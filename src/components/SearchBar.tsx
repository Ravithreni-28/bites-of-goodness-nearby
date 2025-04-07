
import { useState } from 'react';
import { Check, ChevronsUpDown, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { dietaryTags, foodTags } from '@/utils/mockData';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search for food nearby..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Price</h4>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All prices</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free">Free only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid">Paid only</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Dietary Preferences</h4>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryTags.slice(0, 6).map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox id={`diet-${tag}`} />
                      <Label htmlFor={`diet-${tag}`} className="text-sm capitalize">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Distance</h4>
                <RadioGroup defaultValue="5km">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1km" id="1km" />
                    <Label htmlFor="1km">Within 1 km</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5km" id="5km" />
                    <Label htmlFor="5km">Within 5 km</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10km" id="10km" />
                    <Label htmlFor="10km">Within 10 km</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-2 flex justify-between">
                <Button variant="outline" size="sm">Reset</Button>
                <Button size="sm" className="bg-eco-green hover:bg-eco-green-dark">
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          className="bg-eco-green hover:bg-eco-green-dark" 
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
