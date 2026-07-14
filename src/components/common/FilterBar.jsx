import { Button } from "../ui/button";

export function FilterBar({ options, selected, onSelect, allLabel = "All" }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selected === "All" ? "default" : "outline"}
        onClick={() => onSelect("All")}
        size="sm"
      >
        {allLabel}
      </Button>
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option ? "default" : "outline"}
          onClick={() => onSelect(option)}
          size="sm"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
