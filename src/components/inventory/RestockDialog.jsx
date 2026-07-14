import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function RestockDialog({ open, item, amount, note, onAmountChange, onNoteChange, onConfirm, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock Item</DialogTitle>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Item Name</p>
              <p className="font-semibold">{item.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="font-semibold">
                  {item.currentStock} {item.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reorder Level</p>
                <p className="font-semibold">
                  {item.reorderLevel} {item.unit}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="restock-amount">
                Restock Amount ({item.unit})
              </Label>
              <Input
                id="restock-amount"
                type="number"
                placeholder="Enter amount to add"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="restock-note">Note *</Label>
              <Textarea
                id="restock-note"
                placeholder="e.g., Weekly supplier delivery"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                className="mt-2"
                rows={2}
              />
            </div>

            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">New Stock Level</p>
                <p className="text-2xl font-bold text-primary">
                  {item.currentStock + parseFloat(amount)} {item.unit}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Restock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
