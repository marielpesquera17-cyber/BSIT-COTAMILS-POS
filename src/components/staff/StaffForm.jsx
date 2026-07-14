import { useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Camera, User, X } from "lucide-react";
import { toast } from "sonner";

export function StaffForm({ open, mode, formData, onChange, onSave, onClose }) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("Image is too large. Please choose an image under 1MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Register Staff" : "Update Staff"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative group">
              {formData.image ? (
                <img
                  src={formData.image}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                  alt="Staff photo"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-dashed">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-3.5 h-3.5" />
              </Button>
              {formData.image && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full"
                  onClick={() => onChange({ ...formData, image: null })}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <Label className="text-xs text-muted-foreground">
              Click camera to upload profile photo
            </Label>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name *</Label>
            <Input
              id="staff-name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder="e.g., Juan Dela Cruz"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email Address *</Label>
            <Input
              id="staff-email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange({ ...formData, email: e.target.value })}
              placeholder="email@cotamila.com"
            />
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) => onChange({ ...formData, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => onChange({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {mode === "add" ? "Create Account" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
