import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions.js";
import { useAuth } from "../hooks/useAuth.js";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

// ── Common Components ────────────────────────────────────────────────────────
import { PageHeader } from "../components/common/PageHeader.jsx";
import { SearchBar } from "../components/common/SearchBar.jsx";
import { FilterBar } from "../components/common/FilterBar.jsx";

// ── Transaction Components ───────────────────────────────────────────────────
import { TransactionSummaryCards } from "../components/transactions/TransactionSummaryCards.jsx";
import { TransactionTable } from "../components/transactions/TransactionTable.jsx";
import { ReceiptDialog } from "../components/transactions/ReceiptDialog.jsx";
import { RefundDialog } from "../components/transactions/RefundDialog.jsx";

const STATUS_OPTIONS = ["Completed", "Refunded", "Pending"];

export function TransactionHistoryPage() {
  const { transactions, loading, refundTransaction, getTransactionDetails } = useTransactions();
  const { currentUser } = useAuth();
  const canRefund = currentUser?.role === "Manager";

  // ── UI State ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [receiptDialog, setReceiptDialog] = useState({ open: false, transaction: null });
  const [refundDialog, setRefundDialog] = useState({ open: false, transaction: null });

  // ── Derived Data ──────────────────────────────────────────────────────────
  const filteredTransactions = transactions.filter((txn) => {
    const idText = String(txn.orderNumber ?? txn.id ?? "");
    const matchesSearch =
      idText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.cashier || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || txn.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.total, 0);
  const completedCount = transactions.filter((t) => t.status === "Completed").length;
  const refundedCount = transactions.filter((t) => t.status === "Refunded").length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  // The order list endpoint doesn't include line items, so fetch full order
  // details (GET /orders/:orderId) the moment the receipt is opened.
  const handleViewReceipt = async (txn) => {
    setReceiptDialog({ open: true, transaction: txn });
    try {
      const details = await getTransactionDetails(txn.id);
      setReceiptDialog({ open: true, transaction: { ...txn, ...details } });
    } catch (err) {
      toast.error(err.message || "Failed to load transaction details");
    }
  };

  const handleOpenRefund = (txn) => {
    if (!canRefund) {
      toast.error("Only managers can issue refunds");
      return;
    }
    setRefundDialog({ open: true, transaction: txn });
  };

  const handleConfirmRefund = (reason) => {
    if (!canRefund || !refundDialog.transaction) return;

    // NOTE: the backend has no refund endpoint yet, so this only updates the
    // UI locally and will not persist after a refresh. Add a route/service
    // on the server if you need refunds to be permanent.
    refundTransaction(refundDialog.transaction.id, {
      reason,
      refundedBy: currentUser.name,
    });

    toast.success(
      `Order ${refundDialog.transaction.orderNumber ? `#${refundDialog.transaction.orderNumber}` : refundDialog.transaction.id} marked as refunded (not yet persisted on the server)`,
    );

    setRefundDialog({ open: false, transaction: null });
    setReceiptDialog({ open: false, transaction: null });
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <PageHeader
        title="Transaction History"
        subtitle="View and manage all transactions"
      />

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <TransactionSummaryCards
        totalRevenue={totalRevenue}
        totalCount={transactions.length}
        completedCount={completedCount}
        refundedCount={refundedCount}
      />

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by order number or cashier..."
              className="flex-1"
            />
            <FilterBar
              options={STATUS_OPTIONS}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Transactions Table ────────────────────────────────────────────── */}
      {loading && transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading transactions...</p>
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          onView={handleViewReceipt}
          onRefund={handleOpenRefund}
          canRefund={canRefund}
        />
      )}

      {/* ── Receipt Dialog ────────────────────────────────────────────────── */}
      <ReceiptDialog
        open={receiptDialog.open}
        transaction={receiptDialog.transaction}
        onClose={() => setReceiptDialog({ open: false, transaction: null })}
        onRefund={handleOpenRefund}
        canRefund={canRefund}
      />

      {/* ── Refund Dialog ─────────────────────────────────────────────────── */}
      <RefundDialog
        open={refundDialog.open}
        transaction={refundDialog.transaction}
        onConfirm={handleConfirmRefund}
        onClose={() => setRefundDialog({ open: false, transaction: null })}
      />
    </div>
  );
}
