import apiClient from "./client.js";

// Matches server/src/routes/dashboard.route.js -> mounted at /api/v1/dashboard
export const dashboardApi = {
  getKpis: () => apiClient.get("/dashboard/kpis").then((res) => res.data),
  getDailyRevenue: () => apiClient.get("/dashboard/revenue/daily").then((res) => res.data),
  getPeakHours: () => apiClient.get("/dashboard/peak-hours").then((res) => res.data),
  getCategoryRevenue: () => apiClient.get("/dashboard/category-revenue").then((res) => res.data),
  getBestSeller: () => apiClient.get("/dashboard/best-seller").then((res) => res.data),
};

export default dashboardApi;
