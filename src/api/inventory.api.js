import apiClient from "./client.js";

// Matches server/src/routes/inventory.route.js -> mounted at /api/v1/inventory
export const inventoryApi = {
  getAll: (search, category) =>
    apiClient.get("/inventory", { search, category }).then((res) => res.data),
  getAlerts: () => apiClient.get("/inventory/alerts").then((res) => res.data),
  getById: (itemId) => apiClient.get(`/inventory/${itemId}`).then((res) => res.data),
  create: (payload) => apiClient.post("/inventory", payload).then((res) => res.data),
  update: (itemId, payload) =>
    apiClient.put(`/inventory/${itemId}`, payload).then((res) => res.data),
  remove: (itemId) => apiClient.delete(`/inventory/${itemId}`),
  restock: (itemId, payload) =>
    apiClient.post(`/inventory/${itemId}/restock`, payload).then((res) => res.data),
};

export default inventoryApi;
