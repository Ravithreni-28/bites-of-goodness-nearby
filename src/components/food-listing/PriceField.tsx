
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { IndianRupee } from 'lucide-react';

interface PriceFieldProps {
  price: number;
  onPriceChange: (value: number[]) => void;
}

export const PriceField = ({ price, onPriceChange }: PriceFieldProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label htmlFor="price" className="flex items-center">
          <span>Price: </span>
          <IndianRupee className="h-3.5 w-3.5 mx-1" />
          <span>{price.toFixed(0)}</span>
        </Label>
      </div>
      <Slider
        id="price"
        min={0}
        max={1000}
        step={10}
        value={[price]}
        onValueChange={onPriceChange}
      />
    </div>
  );
};
