import { Button } from "../ui/button";

// `categories` is the real category list fetched from GET /menu/categories,
// each shaped like { categoryId, categoryName }.
export function CategoryFilter({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selected === "All" ? "default" : "outline"}
        onClick={() => onSelect("All")}
        size="sm"
        className="rounded-full"
      >
        All Items
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.categoryId}
          variant={selected === cat.categoryName ? "default" : "outline"}
          onClick={() => onSelect(cat.categoryName)}
          size="sm"
          className="rounded-full"
        >
          {cat.categoryName}
        </Button>
      ))}
    </div>
  );
}
