import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { orderApi } from "../api/order.api.js";
import { useAuth } from "../hooks/useAuth.js";

const TransactionContext = createContext(undefined);

// Normalizes a backend order (orderId, totalAmount, createdAt, cashier) into the
// shape the existing UI components expect (id, total, date).
function normalizeOrder(order) {
  if (!order) return null;
  return {
    ...order,
    id: order.orderId,
    total: order.totalAmount,
    date: order.createdAt,
    cashier: typeof order.cashier === "object" ? order.cashier?.name : order.cashier,
  };
}

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await orderApi.getAll();
      setTransactions((orders || []).map(normalizeOrder));
    } catch (err) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setTransactions([]);
  }, [isAuthenticated, refresh]);

  // The order list endpoint doesn't include line items; fetch full order
  // details (with items) on demand, e.g. when opening the receipt dialog.
  const getTransactionDetails = useCallback(async (id) => {
    const order = await orderApi.getById(id);
    return normalizeOrder(order);
  }, []);

  // Called by CartContext consumers right after a successful checkout so the
  // new order shows up in the list immediately without a full refetch.
  const addTransaction = useCallback((order) => {
    setTransactions((prev) => [normalizeOrder(order), ...prev]);
  }, []);

  // NOTE: the backend does not currently expose a refund endpoint
  // (no PATCH/POST route for order refunds in order.route.js). This updates
  // local state only, so a refund here is NOT persisted server-side / will
  // reappear as "Completed" after a refresh. Add a refund endpoint on the
  // server if you need this to be permanent.
  const refundTransaction = useCallback((transactionId, { reason, refundedBy } = {}) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? {
              ...txn,
              status: "Refunded",
              refundReason: reason || "",
              refundedBy: refundedBy || "",
              refundedAt: new Date(),
            }
          : txn,
      ),
    );
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        refresh,
        addTransaction,
        refundTransaction,
        getTransactionDetails,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
};
