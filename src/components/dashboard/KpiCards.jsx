import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

export function KpiCards({ todaySales, todayOrders, weeklyRevenue, lowStockCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today's Sales
          </CardTitle>
          <DollarSign className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ₱{todaySales.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {todayOrders} orders today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
          <ShoppingCart className="w-5 h-5 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{todayOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Completed today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Revenue
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₱{weeklyRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </CardTitle>
          <Package className="w-5 h-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">
            {lowStockCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Need reorder</p>
        </CardContent>
      </Card>
    </div>
  );
}
