
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, IndianRupee } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface FoodCardImageProps {
  imageUrl: string;
  title: string;
  price: number;
  featured?: boolean;
  onOpenDetails: () => void;
}

export const FoodCardImage = ({ 
  imageUrl, 
  title, 
  price, 
  featured = false,
  onOpenDetails 
}: FoodCardImageProps) => {
  return (
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
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-white/90 p-0 text-gray-700 hover:bg-white"
              onClick={onOpenDetails}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};
