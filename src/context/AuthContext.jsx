import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api.js";
import { ApiError } from "../api/client.js";

const AuthContext = createContext(undefined);

// Normalizes the different "staff" shapes the backend returns into one
// consistent client-side user object.
function normalizeUser(staff) {
  if (!staff) return null;
  return {
    ...staff,
    id: staff.staffId,
    imageUrl: staff.imageUrl || staff.image || null,
  };
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // authLoading is true until we've checked for an existing session (cookie)
  // on first load. RootLayout should wait for this before redirecting to /login.
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated =
    currentUser !== null && currentUser.status === "Active";

  // Restore session from the httpOnly cookie on first load / refresh.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const staff = await authApi.me();
        if (!cancelled) setCurrentUser(normalizeUser(staff));
      } catch {
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { staff } = await authApi.login(email, password);
      setCurrentUser(normalizeUser(staff));
      return { success: true };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Invalid email or password";
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the request fails, clear the local session so the UI logs out.
    } finally {
      setCurrentUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
