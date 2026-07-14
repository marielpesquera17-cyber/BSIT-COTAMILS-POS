import { Card } from "../ui/card";
import { Coffee } from "lucide-react";
import { memo } from "react";

const MenuItemCard = memo(function MenuItemCard({ item, onClick }) {
  const prices = item.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    minPrice === maxPrice ? `₱${minPrice}` : `₱${minPrice}–${maxPrice}`;

  return (
    <Card
      className="group relative p-0 cursor-pointer overflow-hidden border border-border/70 hover:border-foreground/30 hover:shadow-md transition-all"
      onClick={() => onClick(item)}
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Coffee className="w-8 h-8 opacity-30" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold tabular-nums">{priceLabel}</span>
          {item.variants.length > 1 && (
            <span className="text-[11px] text-muted-foreground">
              {item.variants.map((v) => v.label).join(" / ")}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
});

export { MenuItemCard };
