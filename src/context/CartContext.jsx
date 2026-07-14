import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { posApi } from "../api/pos.api.js";
import { useAuth } from "../hooks/useAuth.js";

const CartContext = createContext(undefined);

// Normalizes a backend cart item (cartItemId, name, variantLabel, unitPrice)
// into the shape the existing cashier UI components expect
// (id, menuItem:{id,name}, variant, quantity, subtotal).
function normalizeCartItem(item) {
  if (!item) return null;
  return {
    id: item.cartItemId,
    menuItem: { id: item.itemId, name: item.name },
    variant: item.variantLabel,
    variantId: item.variantId,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
  };
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [orderType, setOrderTypeState] = useState("Dine In");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const serverCart = await posApi.getCart();
      setCart((serverCart?.items || []).map(normalizeCartItem));
      if (serverCart?.orderType) setOrderTypeState(serverCart.orderType);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else {
      setCart([]);
      setOrderTypeState("Dine In");
    }
  }, [isAuthenticated, refresh]);

  // item: { menuItem: {id, name}, variantId, variant (label), quantity }
  const addToCart = useCallback(async (item) => {
    const created = await posApi.addItem({
      itemId: item.menuItem.id,
      variantId: item.variantId,
      quantity: item.quantity,
    });
    setCart((prev) => [...prev, normalizeCartItem(created)]);
  }, []);

  const removeFromCart = useCallback(async (cartItemId) => {
    await posApi.removeItem(cartItemId);
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateCartItem = useCallback(async (cartItemId, updates) => {
    const updated = await posApi.updateItem(cartItemId, updates.quantity);
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? normalizeCartItem(updated) : item)),
    );
  }, []);

  const clearCart = useCallback(async () => {
    await posApi.clearCart();
    setCart([]);
  }, []);

  const setOrderType = useCallback(async (type) => {
    setOrderTypeState(type); // optimistic
    try {
      await posApi.setOrderType(type);
    } catch (err) {
      setError(err.message || "Failed to update order type");
    }
  }, []);

  // Completes the current server-side cart into a real order via POST /pos/checkout.
  // Returns the created order (with items, cashier, totals) on success.
  const checkout = useCallback(async ({ paymentMethod, amountReceived }) => {
    const order = await posApi.checkout({ paymentMethod, amountReceived });
    setCart([]);
    return order;
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      orderType,
      setOrderType,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      checkout,
      refresh,
      totalItems: cart.length,
      totalPrice: cart.reduce((sum, item) => sum + (item.subtotal || 0), 0),
    }),
    [cart, loading, error, orderType, setOrderType, addToCart, removeFromCart, updateCartItem, clearCart, checkout, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
