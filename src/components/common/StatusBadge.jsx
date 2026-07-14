import { Badge } from "../ui/badge";

const variantMap = {
  Active: "default",
  Inactive: "outline",
  Completed: "default",
  Refunded: "destructive",
  Pending: "secondary",
  "Low Stock": "destructive",
  Medium: "secondary",
  "In Stock": "default",
  Manager: "default",
  Cashier: "secondary",
};

export function StatusBadge({ status, className = "" }) {
  const variant = variantMap[status] || "outline";
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
