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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function MenuItemForm({ open, mode, formData, categories = [], onChange, onSave, onClose }) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. Please select an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  };

  const addVariantRow = () => {
    onChange({
      ...formData,
      variants: [...formData.variants, { label: "", price: "" }],
    });
  };

  const removeVariantRow = (index) => {
    if (formData.variants.length === 1) {
      toast.error("At least one price option is required");
      return;
    }
    const updated = [...formData.variants];
    updated.splice(index, 1);
    onChange({ ...formData, variants: updated });
  };

  const updateVariantRow = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, variants: updated });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.image ? (
                <div className="relative w-full h-40">
                  <img
                    src={formData.image}
                    className="w-full h-full object-cover rounded-md"
                    alt="Preview"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ ...formData, image: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-primary" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">Max 2MB</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="item-name">Item Name *</Label>
            <Input
              id="item-name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder="e.g., Spanish Latte"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="item-desc">Description</Label>
            <Textarea
              id="item-desc"
              value={formData.description || ""}
              onChange={(e) =>
                onChange({ ...formData, description: e.target.value })
              }
              placeholder="Short description shown on the order screen (optional)"
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={formData.categoryId ? String(formData.categoryId) : ""}
              onValueChange={(v) => onChange({ ...formData, categoryId: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Variants & Prices */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold">Options & Prices *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariantRow}>
                <Plus className="w-3 h-3 mr-1" /> Add Option
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              e.g. Hot / Iced, or "Regular" for a single fixed price.
            </p>

            {formData.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    Label
                  </Label>
                  <Input
                    placeholder="e.g. Hot, Iced, Regular"
                    value={variant.label}
                    onChange={(e) => updateVariantRow(index, "label", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    Price (₱)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.price}
                    onChange={(e) => updateVariantRow(index, "price", e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeVariantRow(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {mode === "add" ? "Add Item" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
