import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

export function CustomizeDialog({
  open,
  item,
  selectedVariant,
  quantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onClose,
}) {
  if (!item) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-md" />
      </Dialog>
    );
  }

  const variantPrice =
    item.variants.find((v) => v.label === selectedVariant)?.price ??
    item.variants[0].price;
  const lineTotal = variantPrice * quantity;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          {item.description && (
            <p className="text-sm text-muted-foreground text-left">
              {item.description}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-5">
          {/* Variant (Hot/Iced/Regular/etc) */}
          {item.variants.length > 1 && (
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Choose Option
              </label>
              <div className="flex gap-2">
                {item.variants.map((v) => (
                  <Button
                    key={v.label}
                    variant={selectedVariant === v.label ? "default" : "outline"}
                    onClick={() => onVariantChange(v.label)}
                    className="flex-1 flex-col h-auto py-2"
                  >
                    <span className="font-semibold">{v.label}</span>
                    <span className="text-xs opacity-80">₱{v.price}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(quantity + 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddToCart} className="font-semibold">
            Add to Cart · ₱{lineTotal.toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
