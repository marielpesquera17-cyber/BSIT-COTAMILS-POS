import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboard.api.js";
import { useInventory } from "../hooks/useInventory.js";

// ── Common Components ────────────────────────────────────────────────────────
import { PageHeader } from "../components/common/PageHeader.jsx";

// ── Dashboard Components ─────────────────────────────────────────────────────
import { KpiCards } from "../components/dashboard/KpiCards.jsx";
import { BestSellersTable } from "../components/dashboard/BestSellersTable.jsx";
import { CategoryPieChart } from "../components/dashboard/CategoryPieChart.jsx";

// ── Chart Components ─────────────────────────────────────────────────────────
import { DailyRevenueLineChart } from "../components/charts/DailyRevenueLineChart.jsx";
import { PeakHoursBarChart } from "../components/charts/PeakHoursBarChart.jsx";

// ── Inventory Components ─────────────────────────────────────────────────────
import { LowStockBanner } from "../components/inventory/LowStockBanner.jsx";

const EMPTY_KPIS = { todaySales: 0, todayOrders: 0, weeklyRevenue: 0, lowStockCount: 0 };

export function DashboardPage() {
  const { inventory } = useInventory();

  const [kpis, setKpis] = useState(EMPTY_KPIS);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [kpisRes, dailyRes, peakRes, catRes, bestRes] = await Promise.all([
          dashboardApi.getKpis(),
          dashboardApi.getDailyRevenue(),
          dashboardApi.getPeakHours(),
          dashboardApi.getCategoryRevenue(),
          dashboardApi.getBestSeller(),
        ]);

        if (cancelled) return;

        setKpis(kpisRes || EMPTY_KPIS);

        setDailyRevenue(
          (dailyRes || []).map((d) => ({
            date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            revenue: d.revenue,
          })),
        );

        setPeakHours(
          (peakRes || []).map((h) => ({
            hour: h.hour,
            sales: h.revenue,
            orders: h.orders,
          })),
        );

        setCategoryRevenue(
          (catRes || [])
            .filter((c) => c.revenue > 0)
            .map((c) => ({ name: c.category, value: c.revenue })),
        );

        setBestSellers(
          (bestRes || [])
            .filter((b) => b.quantitySold > 0)
            .slice(0, 5)
            .map((b) => ({ name: b.name, count: b.quantitySold, revenue: b.revenue })),
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.reorderLevel);

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <PageHeader
        title="Manager Dashboard"
        subtitle="Overview of store performance and metrics"
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading dashboard...</p>
      ) : (
        <>
          {/* ── KPI Cards ─────────────────────────────────────────────────── */}
          <KpiCards
            todaySales={kpis.todaySales}
            todayOrders={kpis.todayOrders}
            weeklyRevenue={kpis.weeklyRevenue}
            lowStockCount={kpis.lowStockCount}
          />

          {/* ── Daily Revenue Line Chart ──────────────────────────────────── */}
          <DailyRevenueLineChart data={dailyRevenue} />

          {/* ── Peak Hours + Category Pie (side by side) ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PeakHoursBarChart data={peakHours} />
            <CategoryPieChart data={categoryRevenue} />
          </div>

          {/* ── Best Sellers Table ────────────────────────────────────────── */}
          <BestSellersTable items={bestSellers} />

          {/* ── Low Stock Banner ──────────────────────────────────────────── */}
          <LowStockBanner items={lowStockItems} />
        </>
      )}
    </div>
  );
}
