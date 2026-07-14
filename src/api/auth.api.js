import apiClient from "./client.js";

// Matches server/src/routes/auth.route.js -> mounted at /api/v1/auth
export const authApi = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }).then((res) => res.data),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/auth/me").then((res) => res.data),
};

export default authApi;
