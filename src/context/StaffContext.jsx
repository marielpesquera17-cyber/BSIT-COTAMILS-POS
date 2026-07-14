import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { staffApi } from "../api/staff.api.js";
import { useAuth } from "../hooks/useAuth.js";

const StaffContext = createContext(undefined);

// Normalizes a backend staff record (staffId, imageUrl) into the shape the
// existing UI components expect (id, image).
function normalizeStaff(member) {
  if (!member) return null;
  return {
    ...member,
    id: member.staffId,
    image: member.imageUrl || null,
  };
}

export const StaffProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await staffApi.getAll();
      setStaff((result || []).map(normalizeStaff));
    } catch (err) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setStaff([]);
  }, [isAuthenticated, refresh]);

  // payload: { name, email, role, status, image }
  const addStaff = async (payload) => {
    const created = await staffApi.create({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      imageUrl: payload.image,
    });
    const normalized = normalizeStaff(created);
    setStaff((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updateStaff = async (id, payload) => {
    const existing = staff.find((s) => s.id === id);
    const updated = await staffApi.update(id, {
      name: payload.name ?? existing?.name,
      email: payload.email ?? existing?.email,
      role: payload.role ?? existing?.role,
      status: payload.status ?? existing?.status,
      imageUrl: payload.image ?? existing?.image,
    });
    const normalized = normalizeStaff(updated);
    setStaff((prev) => prev.map((s) => (s.id === id ? normalized : s)));
    return normalized;
  };

  const deleteStaff = async (id) => {
    await staffApi.remove(id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStaffStatus = async (id, status) => {
    const updated = await staffApi.updateStatus(id, status);
    const normalized = normalizeStaff(updated);
    setStaff((prev) => prev.map((s) => (s.id === id ? normalized : s)));
    return normalized;
  };

  return (
    <StaffContext.Provider
      value={{
        staff,
        loading,
        error,
        refresh,
        addStaff,
        updateStaff,
        deleteStaff,
        updateStaffStatus,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};
