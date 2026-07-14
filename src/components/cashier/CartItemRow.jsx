import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItemRow({ item, onQuantityChange, onRemove }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{item.menuItem.name}</h4>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {item.variant}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuantityChange(item.id, -1)}>
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button variant="outline" size="sm" onClick={() => onQuantityChange(item.id, 1)}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <span className="font-semibold">
          ₱{item.subtotal.toFixed(2)}
        </span>
      </div>
    </Card>
  );
}
