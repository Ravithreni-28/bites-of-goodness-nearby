
import { useState } from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
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
        <div className="absolute top-2 right-2">
          <Badge 
            className={price === null ? "bg-food-orange/90 text-white" : "bg-white/90 text-gray-700"}
          >
            {price === null ? 'Free' : `$${price.toFixed(2)}`}
          </Badge>
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
