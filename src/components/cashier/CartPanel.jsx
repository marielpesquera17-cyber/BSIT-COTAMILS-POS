import { useLocation } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { CartItemRow } from "./CartItemRow";
import { Coffee, X } from "lucide-react";

export function CartPanel({
  cart,
  orderNumber,
  orderType,
  onOrderTypeChange,
  onQuantityChange,
  onRemove,
  onClear,
  onCheckout,
}) {
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="w-96 h-full bg-card border-l border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold">Order #{orderNumber}</h3>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {cart.length} item(s)
        </p>

        {/* Order type toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={orderType === "Dine In" ? "default" : "outline"}
            size="sm"
            onClick={() => onOrderTypeChange("Dine In")}
          >
            Dine In
          </Button>
          <Button
            variant={orderType === "Take Out" ? "default" : "outline"}
            size="sm"
            onClick={() => onOrderTypeChange("Take Out")}
          >
            Take Out
          </Button>
        </div>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1 min-h-0 p-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
            <Coffee className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm">No items in cart</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-muted/50 shrink-0">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">₱{cartTotal.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">₱{cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
