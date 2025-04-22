import { useState } from 'react';
import { MapPin, Clock, Star, IndianRupee, MoreHorizontal, Phone, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format, formatDistance } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FoodListing } from '@/utils/mockData';

interface FoodCardProps {
  listing: FoodListing;
  featured?: boolean;
}

export const FoodCard = ({ listing, featured = false }: FoodCardProps) => {
  const { 
    title, 
    description, 
    price, 
    quantity, 
    imageUrl, 
    location, 
    postedAt, 
    seller,
    tags,
    dietary
  } = listing;

  const [showDetails, setShowDetails] = useState(false);
  const formattedTime = formatDistance(postedAt, new Date(), { addSuffix: true });

  return (
    <Card className={`overflow-hidden hover-scale ${featured ? 'border-eco-green border-2' : ''}`}>
      <div className="relative pb-[60%] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-eco-green text-white">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className="bg-white/90 text-gray-700">
            <span className="flex items-center">
              <IndianRupee className="h-3 w-3 mr-0.5" />
              {price.toFixed(0)}
            </span>
          </Badge>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-6 w-6 rounded-full bg-white/90 p-0 text-gray-700 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DialogTrigger>
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
                  {dietary.map(item => (
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
                        <><IndianRupee className="h-3 w-3 inline mr-0.5" />{price.toFixed(0)}</>
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
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    Owner Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground min-w-24">Name:</span>
                      <span className="text-sm font-medium flex items-center">
                        {seller.name}
                        <span className="flex items-center text-amber-500 ml-2">
                          <Star className="h-3 w-3 fill-current text-amber-500" />
                          <span className="ml-0.5">{seller.rating}</span>
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground min-w-24">Phone:</span>
                      <span className="text-sm font-medium flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        {seller.phone || "+91 9876XXXXXX"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground min-w-24">Location:</span>
                      <span className="text-sm font-medium flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {location.display}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Contact Owner</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CardHeader className="pt-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{location.display} • {location.distance} km</span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {dietary.length > 0 && dietary.map(item => (
            <Badge key={item} variant="outline" className="text-xs bg-green-50">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center text-sm">
            <span className="mr-1">{seller.name}</span>
            <span className="flex items-center text-amber-500">
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span className="ml-0.5">{seller.rating}</span>
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {formattedTime}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
