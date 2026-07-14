import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "../ui/table";
import { Eye, RotateCcw } from "lucide-react";

function getStatusVariant(status) {
  switch (status) {
    case "Completed": return "default";
    case "Refunded": return "destructive";
    case "Pending": return "secondary";
    default: return "outline";
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function TransactionTable({ transactions, onView, onRefund, canRefund = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-semibold">
                      {txn.orderNumber ? `#${txn.orderNumber}` : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell className="text-sm">{formatDate(txn.date)}</TableCell>
                    <TableCell>{txn.items ? `${txn.items.length} item(s)` : "—"}</TableCell>
                    <TableCell>{txn.cashier}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">₱{txn.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(txn.status)}>{txn.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onView(txn)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        {canRefund && txn.status === "Completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onRefund(txn)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" /> Refund
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
