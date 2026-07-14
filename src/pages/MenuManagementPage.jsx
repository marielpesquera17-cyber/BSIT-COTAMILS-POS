import { useState } from "react";
import { useMenu } from "../hooks/useMenu.js";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// ── Common Components ────────────────────────────────────────────────────────
import { PageHeader } from "../components/common/PageHeader.jsx";
import { SearchBar } from "../components/common/SearchBar.jsx";
import { FilterBar } from "../components/common/FilterBar.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";

// ── Menu Components ──────────────────────────────────────────────────────────
import { MenuStatsCards } from "../components/menu/MenuStatsCards.jsx";
import { MenuItemCard } from "../components/menu/MenuItemCard.jsx";
import { MenuItemForm } from "../components/menu/MenuItemForm.jsx";
import { DeleteConfirmDialog } from "../components/menu/DeleteConfirmDialog.jsx";

const EMPTY_FORM = {
  name: "",
  description: "",
  categoryId: "",
  image: null,
  isActive: true,
  variants: [{ label: "Hot", price: "" }],
};

export function MenuManagementPage() {
  const { menuItems, categories, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editDialog, setEditDialog] = useState({ open: false, item: null, mode: "add" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [formData, setFormData] = useState(EMPTY_FORM);

  // ── Derived Data ──────────────────────────────────────────────────────────
  const categoryNames = categories.map((c) => c.categoryName);
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setFormData({ ...EMPTY_FORM, categoryId: categories[0]?.categoryId ?? "" });
    setEditDialog({ open: true, item: null, mode: "add" });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId ?? "",
      image: item.image || null,
      isActive: item.isActive ?? true,
      variants: item.variants?.map((v) => ({
        label: v.label,
        price: v.price.toString(),
        variantId: v.variantId,
      })) || [{ label: "Regular", price: "" }],
    });
    setEditDialog({ open: true, item, mode: "edit" });
  };

  const handleSave = async () => {
    const isVariantsValid = formData.variants.every(
      (v) => v.label.trim() !== "" && v.price !== "" && parseFloat(v.price) > 0
    );
    if (!formData.name.trim() || !formData.categoryId || !isVariantsValid) {
      toast.error("Please fill in the item name, category, and all option/price fields correctly.");
      return;
    }
    if (!formData.image) {
      toast.error("Please upload a product image.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      image: formData.image,
      isActive: formData.isActive,
      variants: formData.variants.map((v) => ({ label: v.label, price: parseFloat(v.price) })),
    };

    try {
      if (editDialog.mode === "add") {
        await addMenuItem(payload);
        toast.success("Menu item added successfully!");
      } else if (editDialog.item) {
        await updateMenuItem(editDialog.item.id, payload);
        toast.success("Menu item updated successfully!");
      }
      setEditDialog({ open: false, item: null, mode: "add" });
    } catch (err) {
      toast.error(err.message || "Failed to save menu item");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await deleteMenuItem(deleteDialog.item.id);
        toast.success("Menu item deleted");
        setDeleteDialog({ open: false, item: null });
      } catch (err) {
        toast.error(err.message || "Failed to delete menu item");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <PageHeader title="Menu Management" subtitle="Add and manage Cotamila's menu items and prices">
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Menu Item
        </Button>
      </PageHeader>

      {/* ── Stats Cards ───────────────────────────────────────────────────── */}
      <MenuStatsCards menuItems={menuItems} />

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search menu items..."
              className="flex-1"
            />
            <FilterBar
              options={categoryNames}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              allLabel="All"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Menu Items Grid ───────────────────────────────────────────────── */}
      {loading && menuItems.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading menu...</p>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No menu items found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeleteDialog({ open: true, item })}
            />
          ))}
        </div>
      )}

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      <MenuItemForm
        open={editDialog.open}
        mode={editDialog.mode}
        formData={formData}
        categories={categories}
        onChange={setFormData}
        onSave={handleSave}
        onClose={() => setEditDialog({ open: false, item: null, mode: "add" })}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        itemName={deleteDialog.item?.name}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      />
    </div>
  );
}
