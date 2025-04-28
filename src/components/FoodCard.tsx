
import { useState } from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { formatRelativeTime, isValidDate } from '@/utils/format';
import type { FoodListing } from '@/utils/mockData';
import { AddToCartButton } from './AddToCartButton';
import { FoodCardImage } from './food-card/FoodCardImage';
import { FoodCardContent } from './food-card/FoodCardContent';
import { FoodCardDetails } from './food-card/FoodCardDetails';
import { Dialog } from '@/components/ui/dialog';

interface FoodCardProps {
  listing: FoodListing;
  featured?: boolean;
}

const FoodCard = ({ listing, featured = false }: FoodCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Add safety check for date formatting
  const formattedTime = isValidDate(listing.postedAt) 
    ? formatRelativeTime(listing.postedAt) 
    : 'Recently';

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${featured ? 'col-span-2' : ''}`}>
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <FoodCardImage
          imageUrl={listing.imageUrl}
          title={listing.title}
          price={listing.price}
          featured={featured}
          onOpenDetails={() => setShowDetails(true)}
        />
        
        <FoodCardContent listing={listing} />

        {showDetails && (
          <FoodCardDetails 
            listing={listing}
            formattedTime={formattedTime}
          />
        )}
      </Dialog>

      <CardFooter className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">
          ₹{listing.price}
        </div>
        <AddToCartButton 
          listingId={listing.id} 
          title={listing.title} 
          price={listing.price}
        />
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
