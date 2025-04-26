
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from '@/stores/useCartStore';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AddToCartButtonProps {
  listingId: string;
  title: string;
  price: number;
  imageUrl?: string | null;
}

export const AddToCartButton = ({ listingId, title, price, imageUrl }: AddToCartButtonProps) => {
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate('/login');
      return;
    }

    const cartItem: CartItem = {
      id: crypto.randomUUID(),
      listing_id: listingId,
      title,
      price,
      quantity: 1,
      image_url: imageUrl
    };

    addItem(cartItem);
    toast.success(`${title} has been added to your cart.`);
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
