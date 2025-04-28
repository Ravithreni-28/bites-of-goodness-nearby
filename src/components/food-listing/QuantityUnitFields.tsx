
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuantityUnitFieldsProps {
  quantity: number;
  unit: string;
  onQuantityChange: (value: number) => void;
  onUnitChange: (value: string) => void;
}

export const QuantityUnitFields = ({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
}: QuantityUnitFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input 
          id="quantity" 
          type="number" 
          placeholder="e.g., 2" 
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="servings">Servings</SelectItem>
            <SelectItem value="pieces">Pieces</SelectItem>
            <SelectItem value="grams">Grams</SelectItem>
            <SelectItem value="kg">Kilograms</SelectItem>
            <SelectItem value="container">Container</SelectItem>
            <SelectItem value="handi">Handi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
