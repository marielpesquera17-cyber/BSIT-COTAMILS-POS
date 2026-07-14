import apiClient from "./client.js";

// Matches server/src/routes/menu.route.js -> mounted at /api/v1/menu
export const menuApi = {
  getCategories: () => apiClient.get("/menu/categories").then((res) => res.data),
  getAll: (params) => apiClient.get("/menu/items", params).then((res) => res.data),
  getById: (itemId) => apiClient.get(`/menu/items/${itemId}`).then((res) => res.data),
  create: (payload) => apiClient.post("/menu/items", payload).then((res) => res.data),
  update: (itemId, payload) =>
    apiClient.put(`/menu/items/${itemId}`, payload).then((res) => res.data),
  remove: (itemId) => apiClient.delete(`/menu/items/${itemId}`),
  updateVariantAvailability: (itemId, variantId, isAvailable) =>
    apiClient
      .patch(`/menu/items/${itemId}/availability`, { variantId, isAvailable })
      .then((res) => res.data),
};

export default menuApi;
