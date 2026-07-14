import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RotateCcw } from "lucide-react";

const REFUND_REASONS = [
  "Customer changed mind",
  "Wrong order / incorrect item",
  "Quality issue",
  "Duplicate transaction",
  "Other",
];

export function RefundDialog({ open, transaction, onConfirm, onClose }) {
  const [reason, setReason] = useState(REFUND_REASONS[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setReason(REFUND_REASONS[0]);
      setNotes("");
    }
  }, [open]);

  const handleConfirm = () => {
    const fullReason = notes.trim() ? `${reason} — ${notes.trim()}` : reason;
    onConfirm(fullReason);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[460px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
            <RotateCcw className="w-6 h-6" />
          </div>
          <DialogTitle>Refund Transaction</DialogTitle>
          <DialogDescription>
            {transaction ? (
              <>
                Refunding{" "}
                <span className="font-bold text-foreground">
                  {transaction.orderNumber ? `Order #${transaction.orderNumber}` : transaction.id}
                </span>{" "}
                for{" "}
                <span className="font-bold text-foreground">
                  ₱{transaction.total?.toFixed(2)}
                </span>
                . This action cannot be undone.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason for refund</Label>
            <select
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-input bg-input-background flex h-9 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {REFUND_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-notes">Additional notes (optional)</Label>
            <Textarea
              id="refund-notes"
              placeholder="Add any extra details about this refund..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-center pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="flex-1">
            Confirm Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
