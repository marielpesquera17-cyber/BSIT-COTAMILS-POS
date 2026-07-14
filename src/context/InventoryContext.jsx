import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { inventoryApi } from "../api/inventory.api.js";
import { useAuth } from "../hooks/useAuth.js";

const InventoryContext = createContext(undefined);

// Normalizes a backend inventory item (itemId, category:{categoryId,categoryName})
// into the shape the existing UI components expect (id, category as string).
function normalizeItem(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.itemId,
    categoryId: item.category?.categoryId ?? null,
    category: item.category?.categoryName ?? "",
  };
}

export const InventoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]); // derived list of {categoryId, categoryName}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inventoryApi.getAll();
      const items = (result?.items || []).map(normalizeItem);
      setInventory(items);

      const catMap = new Map();
      items.forEach((i) => {
        if (i.categoryId != null) catMap.set(i.categoryId, i.category);
      });
      setCategories(
        Array.from(catMap.entries()).map(([categoryId, categoryName]) => ({
          categoryId,
          categoryName,
        })),
      );
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else {
      setInventory([]);
      setCategories([]);
    }
  }, [isAuthenticated, refresh]);

  // updates: { currentStock, lastRestocked, note } -> uses the dedicated /restock endpoint
  // when a delta is implied (InventoryPage's restock flow), otherwise falls back to a
  // full update via PUT /inventory/:itemId.
  const updateInventory = async (id, updates) => {
    const existing = inventory.find((i) => i.id === id);
    if (!existing) return;

    if (Object.prototype.hasOwnProperty.call(updates, "currentStock") && updates.__restock) {
      const quantity = updates.currentStock; // new absolute stock level after restock
      const updated = await inventoryApi.restock(id, {
        quantity,
        note: updates.note || "Restocked via Inventory page",
      });
      const normalized = normalizeItem(updated);
      setInventory((prev) => prev.map((item) => (item.id === id ? normalized : item)));
      return normalized;
    }

    const updated = await inventoryApi.update(id, {
      name: updates.name ?? existing.name,
      categoryId: updates.categoryId ?? existing.categoryId,
      currentStock: updates.currentStock ?? existing.currentStock,
      unit: updates.unit ?? existing.unit,
      reorderLevel: updates.reorderLevel ?? existing.reorderLevel,
    });
    const normalized = normalizeItem(updated);
    setInventory((prev) => prev.map((item) => (item.id === id ? normalized : item)));
    return normalized;
  };

  // payload: { name, categoryId, currentStock, unit, reorderLevel }
  const addInventory = async (payload) => {
    const created = await inventoryApi.create({
      name: payload.name,
      categoryId: Number(payload.categoryId),
      currentStock: Number(payload.currentStock),
      unit: payload.unit,
      reorderLevel: Number(payload.reorderLevel),
    });
    const normalized = normalizeItem(created);
    setInventory((prev) => [normalized, ...prev]);
    return normalized;
  };

  const deleteInventory = async (id) => {
    await inventoryApi.remove(id);
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        categories,
        loading,
        error,
        refresh,
        updateInventory,
        addInventory,
        deleteInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
