// ── Core API Client ──────────────────────────────────────────────────────────
// Thin wrapper around fetch() that talks to the COTAMILA Express backend.
// - Sends/receives the httpOnly JWT cookie automatically (credentials: "include")
// - Unwraps the { success, message, data } envelope every controller returns
// - Throws a normalized ApiError so callers/contexts can show `error.message`

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = "GET", body, params, signal } = {}) {
  let url = `${BASE_URL}${path}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    const qs = query.toString();
    if (qs) url += `?${qs}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      credentials: "include", // send the httpOnly "token" cookie set by /auth/login
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkError) {
    throw new ApiError(
      "Unable to reach the server. Please check your connection or that the API is running.",
      0,
      networkError,
    );
  }

  let payload = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message =
      payload?.message || payload?.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const apiClient = {
  get: (path, params, signal) => request(path, { method: "GET", params, signal }),
  post: (path, body, params) => request(path, { method: "POST", body, params }),
  put: (path, body, params) => request(path, { method: "PUT", body, params }),
  patch: (path, body, params) => request(path, { method: "PATCH", body, params }),
  delete: (path, params) => request(path, { method: "DELETE", params }),
};

export default apiClient;
