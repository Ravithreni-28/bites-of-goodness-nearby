
import { 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, IndianRupee, MapPin, Phone } from 'lucide-react';
import type { FoodListing } from '@/utils/mockData';
import { formatRelativeTime } from '@/utils/format';

interface FoodCardDetailsProps {
  listing: FoodListing;
  formattedTime: string;
}

export const FoodCardDetails = ({ listing, formattedTime }: FoodCardDetailsProps) => {
  const { 
    title, 
    description, 
    price, 
    quantity, 
    imageUrl, 
    location, 
    seller,
    dietary 
  } = listing;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl">{title}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Posted {formattedTime}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="text-sm text-gray-700">{description}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {dietary && dietary.map(item => (
            <Badge key={item} variant="outline" className="text-xs bg-green-50">
              {item}
            </Badge>
          ))}
        </div>
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2 text-muted-foreground" />
            Food Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Price:</span> 
              <span className="font-medium ml-1 flex items-center">
                <IndianRupee className="h-3 w-3 inline mr-0.5" />{price.toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Quantity:</span> 
              <span className="font-medium ml-1">{quantity} servings</span>
            </div>
            <div>
              <span className="text-muted-foreground">Posted:</span> 
              <span className="font-medium ml-1">{formattedTime}</span>
            </div>
          </div>
        </div>
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Avatar className="h-4 w-4 mr-2">
              <AvatarImage src={seller?.avatar} alt={seller?.name} />
              <AvatarFallback>{seller?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            Owner Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-24">Name:</span>
              <span className="text-sm font-medium">{seller?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-24">Phone:</span>
              <span className="text-sm font-medium flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1" />
                {seller?.phone || "+91 9876XXXXXX"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-24">Location:</span>
              <span className="text-sm font-medium flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {typeof location === 'object' ? location.display : location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Contact Owner</Button>
        </div>
      </div>
    </DialogContent>
  );
};
