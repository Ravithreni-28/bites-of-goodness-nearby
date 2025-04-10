
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, IndianRupee } from 'lucide-react';
import { dietaryTags, foodTags } from '@/utils/mockData';

interface FoodListingFormProps {
  onSubmit?: (data: any) => void;
  children?: React.ReactNode;
}

export const FoodListingForm = ({ onSubmit, children }: FoodListingFormProps) => {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(200);
  const [isFree, setIsFree] = useState(false);
  
  const handleDietaryTagToggle = (tag: string) => {
    if (selectedDietary.includes(tag)) {
      setSelectedDietary(selectedDietary.filter(t => t !== tag));
    } else {
      setSelectedDietary([...selectedDietary, tag]);
    }
  };
  
  const handleFoodTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    if (onSubmit) {
      // Collect form data and pass it to onSubmit
      onSubmit({
        title: "Form submitted",
        price: isFree ? null : price,
        dietary: selectedDietary,
        tags: selectedTags
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-eco-green hover:bg-eco-green-dark">
            <Plus className="h-4 w-4 mr-2" />
            Share Food
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Extra Food</DialogTitle>
          <DialogDescription>
            List your excess food to sell or give away to others in your community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="food-photo">Food Photo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Camera className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">JPG, PNG or JPEG (max. 5MB)</p>
              <input id="food-photo" type="file" className="hidden" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Food Title</Label>
            <Input id="title" placeholder="e.g., Homemade Chicken Biryani" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your food, its condition, when it was made, etc."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="e.g., 2" min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select>
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
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-free" 
                checked={isFree} 
                onCheckedChange={(checked) => setIsFree(checked === true)}
              />
              <Label htmlFor="is-free">Offer this food for free</Label>
            </div>
            
            {!isFree && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="price" className="flex items-center">
                    <span>Price: </span>
                    <IndianRupee className="h-3.5 w-3.5 mx-1" />
                    <span>{price.toFixed(0)}</span>
                  </Label>
                </div>
                <Slider
                  id="price"
                  min={20}
                  max={1000}
                  step={10}
                  value={[price]}
                  onValueChange={(value) => setPrice(value[0])}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Dietary Information</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {dietaryTags.map((tag) => (
                <Badge 
                  key={tag}
                  variant={selectedDietary.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    selectedDietary.includes(tag) 
                      ? "bg-eco-green hover:bg-eco-green-dark" 
                      : "hover:bg-eco-green/10"
                  }`}
                  onClick={() => handleDietaryTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Food Tags</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {foodTags.map((tag) => (
                <Badge 
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    selectedTags.includes(tag) 
                      ? "bg-food-orange hover:bg-food-orange-dark" 
                      : "hover:bg-food-orange/10"
                  }`}
                  onClick={() => handleFoodTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Pickup Address</Label>
            <Input placeholder="Your address in Hyderabad" />
            <p className="text-xs text-muted-foreground">
              Only your neighborhood will be shown publicly. Exact address will be shared only with accepted buyers.
            </p>
          </div>
          
          <DialogFooter>
            <Button type="submit" className="bg-eco-green hover:bg-eco-green-dark">
              List Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodListingForm;
