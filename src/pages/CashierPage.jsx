import { useState, useMemo } from "react";
import { useMenu } from "../hooks/useMenu.js";
import { useCart } from "../hooks/useCart.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { useAuth } from "../hooks/useAuth.js";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

// ── Cashier Components ──────────────────────────────────────────────────────
import { CategoryFilter } from "../components/cashier/CategoryFilter.jsx";
import { MenuItemCard } from "../components/cashier/MenuItemCard.jsx";
import { CartPanel } from "../components/cashier/CartPanel.jsx";
import { CustomizeDialog } from "../components/cashier/CustomizeDialog.jsx";
import { CheckoutDialog } from "../components/cashier/CheckoutDialog.jsx";

export function CashierPage() {
  const { menuItems, categories } = useMenu();
  const {
    cart,
    orderType,
    setOrderType,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    checkout,
  } = useCart();
  const { addTransaction } = useTransactions();
  const { currentUser } = useAuth();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customizeDialog, setCustomizeDialog] = useState({
    open: false,
    item: null,
  });
  const [selectedVariant, setSelectedVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Derived Data ──────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleItemClick = (item) => {
    setCustomizeDialog({ open: true, item });
    setSelectedVariant(item.variants[0].label);
    setItemQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!customizeDialog.item) return;
    const item = customizeDialog.item;
    const variant = item.variants.find((v) => v.label === selectedVariant) ?? item.variants[0];

    try {
      await addToCart({
        menuItem: { id: item.itemId, name: item.name },
        variantId: variant.variantId,
        variant: variant.label,
        quantity: itemQuantity,
      });
      setCustomizeDialog({ open: false, item: null });
      toast.success(`${item.name} added to order`);
    } catch (err) {
      toast.error(err.message || "Failed to add item to cart");
    }
  };

  const handleQuantityChange = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await handleRemove(id);
      return;
    }
    try {
      await updateCartItem(id, { quantity: newQty });
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
    } catch (err) {
      toast.error(err.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setAmountReceived("");
    setPaymentMethod("Cash");
    setCheckoutOpen(true);
  };

  const handleCompletePayment = async () => {
    if (
      paymentMethod === "Cash" &&
      (!amountReceived || parseFloat(amountReceived) < cartTotal)
    ) {
      toast.error("Insufficient amount received");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await checkout({
        paymentMethod,
        amountReceived: parseFloat(amountReceived) || cartTotal,
      });
      addTransaction(order);
      setCheckoutOpen(false);
      toast.success(`Order #${order.orderNumber} completed!`);
    } catch (err) {
      toast.error(err.message || "Failed to complete payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex min-h-0">
      {/* ── Left: Product Grid ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background min-h-0">
        <div className="p-6 border-b border-border bg-card space-y-4 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold font-display">
              Point of Sale
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <ScrollArea className="flex-1 min-h-0 p-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-24">
              <p className="text-sm">No items match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Right: Cart ─────────────────────────────────────────────────── */}
      <CartPanel
        cart={cart}
        orderNumber={currentUser?.name ? "New" : "New"}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        onClear={handleClear}
        onCheckout={handleCheckout}
      />

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      <CustomizeDialog
        open={customizeDialog.open}
        item={customizeDialog.item}
        selectedVariant={selectedVariant}
        quantity={itemQuantity}
        onVariantChange={setSelectedVariant}
        onQuantityChange={setItemQuantity}
        onAddToCart={handleAddToCart}
        onClose={() => setCustomizeDialog({ open: false, item: null })}
      />
      <CheckoutDialog
        open={checkoutOpen}
        cart={cart}
        orderNumber="New"
        orderType={orderType}
        paymentMethod={paymentMethod}
        amountReceived={amountReceived}
        onPaymentMethodChange={(m) => {
          setPaymentMethod(m);
          setAmountReceived("");
        }}
        onAmountChange={setAmountReceived}
        onConfirm={handleCompletePayment}
        onClose={() => !isSubmitting && setCheckoutOpen(false)}
      />
    </div>
  );
}
