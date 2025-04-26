
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      toast.error("You need to sign in to complete your purchase");
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);

      // Create stored procedure to handle this transaction
      const { data: order, error: orderError } = await supabase.rpc('create_order', {
        user_id_input: user.id,
        total_amount_input: total,
        order_items_input: items.map(item => ({
          listing_id: item.listing_id,
          quantity: item.quantity,
          price_per_unit: item.price
        }))
      });
      
      if (orderError) throw orderError;

      toast.success("Thank you for your purchase.");
      
      clearCart();
      navigate('/transactions');
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "There was a problem processing your order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => navigate('/')}>
            Browse Food Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {items.map((item) => (
            <div 
              key={item.listing_id}
              className="flex items-center justify-between py-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600">{formatCurrency(item.price)} per item</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateItemQuantity(item.listing_id, item.quantity - 1);
                      }
                    }}
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateItemQuantity(item.listing_id, item.quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="w-20 text-right font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.listing_id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Taxes and delivery fees calculated at checkout
            </p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          
          <div className="space-x-3">
            <Button 
              variant="outline"
              onClick={() => clearCart()}
              className="border-red-200 text-red-500 hover:bg-red-50"
            >
              Clear Cart
            </Button>
            
            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
