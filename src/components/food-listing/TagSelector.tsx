
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface TagSelectorProps {
  label: string;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  className?: string;
  badgeClassName?: string;
}

export const TagSelector = ({
  label,
  tags,
  selectedTags,
  onTagToggle,
  className = "space-y-2",
  badgeClassName = ""
}: TagSelectorProps) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((tag) => (
          <Badge 
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer capitalize ${
              selectedTags.includes(tag) 
                ? "bg-green-600 hover:bg-green-700" 
                : "hover:bg-green-100"
            } ${badgeClassName}`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
