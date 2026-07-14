export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

export const calculateItemSubtotal = (variantPrice, quantity = 1) => {
  return variantPrice * quantity;
};

export const filterByCategory = (items, category) => {
  if (!category) return items;
  return items.filter((item) => item.category === category);
};

export const filterByStatus = (items, status) => {
  if (!status) return items;
  return items.filter((item) => item.status === status);
};

export const filterByRole = (items, role) => {
  if (!role) return items;
  return items.filter((item) => item.role === role);
};

export const searchItems = (items, query) => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery),
  );
};
