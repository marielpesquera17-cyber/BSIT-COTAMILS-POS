import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Coffee, Tag, Wallet, Layers } from "lucide-react";

export function MenuStatsCards({ menuItems }) {
  const categoryCount = new Set(menuItems.map((item) => item.category).filter(Boolean)).size;
  const allPrices = menuItems.flatMap((item) =>
    item.variants.map((v) => v.price),
  );
  const avgPrice = allPrices.length
    ? allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length
    : 0;
  const multiVariantCount = menuItems.filter(
    (item) => item.variants.length > 1,
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            Total Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{menuItems.length}</div>
          <p className="text-xs text-muted-foreground">Across the full menu</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground">Drinks, food & desserts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Average Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₱{avgPrice.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">Per priced option</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Hot & Iced Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{multiVariantCount}</div>
          <p className="text-xs text-muted-foreground">Items with multiple variants</p>
        </CardContent>
      </Card>
    </div>
  );
}
