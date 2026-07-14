import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Banknote, CreditCard, Smartphone, Receipt } from "lucide-react";

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export function CheckoutDialog({
  open,
  cart,
  orderNumber,
  orderType,
  paymentMethod,
  amountReceived,
  onPaymentMethodChange,
  onAmountChange,
  onConfirm,
  onClose,
}) {
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const changeAmount = amountReceived
    ? parseFloat(amountReceived) - cartTotal
    : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex flex-col md:flex-row min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
          {/* Left: Summary */}
          <div className="w-full md:w-5/12 bg-muted/30 p-6 border-b md:border-b-0 md:border-r flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-1 shrink-0">
              <Receipt className="w-5 h-5" />
              <h3 className="font-bold">Order #{orderNumber}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4 shrink-0">
              {orderType}
            </p>

            <ScrollArea className="flex-1 min-h-0 max-h-48 md:max-h-none pr-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm flex justify-between gap-2"
                  >
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.menuItem.name}
                      <span className="text-xs"> ({item.variant})</span>
                    </span>
                    <span className="font-medium shrink-0">
                      ₱{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4 shrink-0" />
            <div className="flex justify-between items-center shrink-0">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold">₱{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Right: Payment */}
          <div className="w-full md:w-7/12 p-6 flex flex-col justify-between min-h-0 overflow-y-auto">
            <div>
              <DialogHeader className="mb-6">
                <DialogTitle>Complete Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentMethod === "Cash" ? "default" : "outline"}
                    onClick={() => onPaymentMethodChange("Cash")}
                    className="h-12 gap-2 flex-col text-xs"
                  >
                    <Banknote className="w-4 h-4" /> Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "Card" ? "default" : "outline"}
                    onClick={() => onPaymentMethodChange("Card")}
                    className="h-12 gap-2 flex-col text-xs"
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </Button>
                  <Button
                    variant={paymentMethod === "GCash" ? "default" : "outline"}
                    onClick={() => onPaymentMethodChange("GCash")}
                    className="h-12 gap-2 flex-col text-xs"
                  >
                    <Smartphone className="w-4 h-4" /> GCash
                  </Button>
                </div>

                {paymentMethod === "Cash" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="cash-input"
                        className="text-xs uppercase font-bold text-muted-foreground"
                      >
                        Amount Received
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                          ₱
                        </span>
                        <Input
                          id="cash-input"
                          type="number"
                          className="pl-8 h-12 text-lg font-bold"
                          placeholder="0.00"
                          value={amountReceived}
                          onChange={(e) => onAmountChange(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {QUICK_AMOUNTS.map((amt) => (
                          <Button
                            key={amt}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[64px] text-xs"
                            onClick={() => onAmountChange(String(amt))}
                          >
                            ₱{amt}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[64px] text-xs"
                          onClick={() => onAmountChange(String(cartTotal))}
                        >
                          Exact
                        </Button>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${
                        changeAmount >= 0
                          ? "bg-green-50 border-green-100"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Change Due</span>
                        <span
                          className={`text-2xl font-bold ${
                            changeAmount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₱{Math.max(0, changeAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div className="p-4 rounded-lg border border-dashed text-sm text-muted-foreground">
                    Insert, tap, or swipe the customer's card on the terminal,
                    then confirm payment.
                  </div>
                )}

                {paymentMethod === "GCash" && (
                  <div className="p-4 rounded-lg border border-dashed text-sm text-muted-foreground">
                    Scan the customer's GCash QR or enter the reference number
                    from the payment confirmation, then confirm payment.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-3 shrink-0">
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-[2] h-12 font-bold"
                onClick={onConfirm}
                disabled={
                  paymentMethod === "Cash" &&
                  (!amountReceived || parseFloat(amountReceived) < cartTotal)
                }
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
