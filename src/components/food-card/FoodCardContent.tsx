
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import type { FoodListing } from '@/utils/mockData';

interface FoodCardContentProps {
  listing: FoodListing;
}

export const FoodCardContent = ({ listing }: FoodCardContentProps) => {
  const { title, description, location, dietary } = listing;
  
  return (
    <>
      <CardHeader className="pt-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>
            {typeof location === 'object' && location?.display 
              ? location.display 
              : location}
            {typeof location === 'object' && location?.distance && (
              <> • {location.distance} km</>
            )}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {dietary && dietary.length > 0 && dietary.map(item => (
            <Badge key={item} variant="outline" className="text-xs bg-green-50">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </>
  );
};
