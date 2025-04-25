import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCartStore } from '@/stores/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Cart = () => {
  const { items, isLoading, fetchCart, removeItem, updateQuantity } = useCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your purchase",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: calculateTotal(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        price_per_unit: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      useCartStore.getState().clearCart();

      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed and is being processed."
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading cart...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.listing_id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.listing_id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.listing_id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.listing_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">₹{calculateTotal()}</span>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
