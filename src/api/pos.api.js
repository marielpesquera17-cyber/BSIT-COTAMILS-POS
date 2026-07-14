import apiClient from "./client.js";

// Matches server/src/routes/pos.route.js -> mounted at /api/v1/pos
// Cart is persisted server-side per logged-in staff member (via the auth cookie).
export const posApi = {
  getCart: () => apiClient.get("/pos/cart").then((res) => res.data),
  addItem: ({ itemId, variantId, quantity }) =>
    apiClient.post("/pos/cart/items", { itemId, variantId, quantity }).then((res) => res.data),
  updateItem: (cartItemId, quantity) =>
    apiClient.put(`/pos/cart/items/${cartItemId}`, { quantity }).then((res) => res.data),
  removeItem: (cartItemId) => apiClient.delete(`/pos/cart/items/${cartItemId}`),
  clearCart: () => apiClient.delete("/pos/cart"),
  setOrderType: (orderType) =>
    apiClient.patch("/pos/cart/order-type", { orderType }),
  checkout: ({ paymentMethod, amountReceived }) =>
    apiClient.post("/pos/checkout", { paymentMethod, amountReceived }).then((res) => res.data),
};

export default posApi;
