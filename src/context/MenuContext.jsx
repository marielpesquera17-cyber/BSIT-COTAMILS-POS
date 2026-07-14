import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { menuApi } from "../api/menu.api.js";
import { useAuth } from "../hooks/useAuth.js";

const MenuContext = createContext(undefined);

// Normalizes a backend menu item (itemId, category:{categoryId,categoryName}, imageUrl)
// into the shape the existing UI components expect (id, category as string, image).
function normalizeMenuItem(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.itemId,
    categoryId: item.category?.categoryId ?? null,
    category: item.category?.categoryName ?? "",
    image: item.imageUrl || null,
  };
}

export const MenuProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]); // [{categoryId, categoryName}]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, cats] = await Promise.all([
        menuApi.getAll(),
        menuApi.getCategories(),
      ]);
      setMenuItems((items || []).map(normalizeMenuItem));
      setCategories(cats || []);
    } catch (err) {
      setError(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else {
      setMenuItems([]);
      setCategories([]);
    }
  }, [isAuthenticated, refresh]);

  // payload: { name, description, category (categoryId as number), image (base64/url), variants }
  const addMenuItem = async (payload) => {
    const created = await menuApi.create({
      name: payload.name,
      categoryId: Number(payload.categoryId ?? payload.category),
      description: payload.description || "",
      imageUrl: payload.image,
      variants: payload.variants,
    });
    const normalized = normalizeMenuItem(created);
    setMenuItems((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updateMenuItem = async (id, payload) => {
    const updated = await menuApi.update(id, {
      name: payload.name,
      categoryId: Number(payload.categoryId ?? payload.category),
      description: payload.description || "",
      imageUrl: payload.image,
      isActive: payload.isActive ?? true,
      variants: payload.variants,
    });
    const normalized = normalizeMenuItem(updated);
    setMenuItems((prev) => prev.map((item) => (item.id === id ? normalized : item)));
    return normalized;
  };

  const deleteMenuItem = async (id) => {
    await menuApi.remove(id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateVariantAvailability = async (itemId, variantId, isAvailable) => {
    const updated = await menuApi.updateVariantAvailability(itemId, variantId, isAvailable);
    const normalized = normalizeMenuItem(updated);
    setMenuItems((prev) => prev.map((item) => (item.id === itemId ? normalized : item)));
    return normalized;
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        loading,
        error,
        refresh,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateVariantAvailability,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
