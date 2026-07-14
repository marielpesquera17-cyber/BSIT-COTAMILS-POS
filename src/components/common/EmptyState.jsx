import { Coffee } from "lucide-react";

export function EmptyState({ icon: Icon = Coffee, title = "No items found", description = "", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Icon className="w-16 h-16 mb-4 opacity-20" />
      <p className="text-base font-medium">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
