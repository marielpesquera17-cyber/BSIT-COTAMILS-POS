import apiClient from "./client.js";

// Matches server/src/routes/staff.route.js -> mounted at /api/v1/staff
export const staffApi = {
  getAll: (search, role) =>
    apiClient.get("/staff", { search, role }).then((res) => res.data),
  getById: (staffId) => apiClient.get(`/staff/${staffId}`).then((res) => res.data),
  create: (payload) => apiClient.post("/staff", payload).then((res) => res.data),
  update: (staffId, payload) =>
    apiClient.put(`/staff/${staffId}`, payload).then((res) => res.data),
  remove: (staffId) => apiClient.delete(`/staff/${staffId}`),
  updateStatus: (staffId, status) =>
    apiClient.patch(`/staff/${staffId}`, { status }).then((res) => res.data),
};

export default staffApi;
