import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export function DeleteConfirmDialog({ open, memberName, onConfirm, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-xl">Confirm Delete</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to remove{" "}
            <span className="font-bold text-foreground">{memberName}</span>?
            This will permanently delete their account and access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes, Delete Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
