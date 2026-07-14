import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Package, AlertTriangle } from "lucide-react";

export function InventoryStatsCards({ totalItems, lowStockCount, categoryCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Items
          </CardTitle>
          <Package className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground mt-1">In inventory</p>
        </CardContent>
      </Card>

      <Card className={lowStockCount > 0 ? "border-destructive" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low Stock Alerts
          </CardTitle>
          <AlertTriangle
            className={`w-5 h-5 ${lowStockCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
          />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${lowStockCount > 0 ? "text-destructive" : ""}`}>
            {lowStockCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Need restocking</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Categories
          </CardTitle>
          <Package className="w-5 h-5 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Distinct types</p>
        </CardContent>
      </Card>
    </div>
  );
}
