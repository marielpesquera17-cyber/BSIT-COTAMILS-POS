import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, Coffee } from "lucide-react";

export function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="w-full h-40 bg-muted relative border-b">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}
      </div>

      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {(item.variants || []).map((v, index) => (
              <Badge key={index} variant="outline" className="text-[10px] bg-muted">
                {v.label}: ₱{v.price}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <Badge variant="secondary" className="text-[10px]">
              {item.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
