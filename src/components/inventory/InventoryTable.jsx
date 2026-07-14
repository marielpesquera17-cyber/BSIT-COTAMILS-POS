import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "../ui/table";
import { Plus } from "lucide-react";

function getStockStatus(item) {
  const pct = (item.currentStock / item.reorderLevel) * 100;
  if (pct <= 100) return { label: "Low Stock", variant: "destructive" };
  if (pct <= 150) return { label: "Medium", variant: "secondary" };
  return { label: "In Stock", variant: "default" };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function InventoryTable({ items, onRestock }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No inventory items match your search
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className={item.currentStock <= item.reorderLevel ? "text-destructive font-semibold" : ""}>
                          {item.currentStock} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>{item.reorderLevel} {item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.lastRestocked)}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => onRestock(item)}>
                          <Plus className="w-4 h-4 mr-1" /> Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
