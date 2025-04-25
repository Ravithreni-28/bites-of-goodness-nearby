
import { Button } from "@/components/ui/button";
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AddToCartButtonProps {
  listingId: string;
  title: string;
  price: number;
}

export const AddToCartButton = ({ listingId, title, price }: AddToCartButtonProps) => {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      await addItem(listingId, title, price);
      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      className="w-full"
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
