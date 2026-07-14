import apiClient from "./client.js";

// Matches server/src/routes/order.route.js -> mounted at /api/v1/orders
export const orderApi = {
  getAll: (params) => apiClient.get("/orders", params).then((res) => res.data),
  getById: (orderId) => apiClient.get(`/orders/${orderId}`).then((res) => res.data),
};

export default orderApi;
