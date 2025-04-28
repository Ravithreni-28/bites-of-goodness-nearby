
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckoutSteps } from "./cart/CheckoutSteps";
import { OrderSummary } from "./cart/OrderSummary";
import { EmptyCart } from "./cart/EmptyCart";
import { CartItem } from "./cart/CartItem";
import { CartSummary } from "./cart/CartSummary";

const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateItemQuantity, 
    clearCart, 
    processCheckout,
    checkoutStatus,
    checkoutError,
    resetCheckoutStatus,
    loading
  } = useCartStore();
  const [orderStep, setOrderStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      resetCheckoutStatus();
    };
  }, [resetCheckoutStatus]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      toast.error("You must be logged in to checkout");
      navigate('/login');
      return;
    }

    try {
      setOrderStep(1);
      const result = await processCheckout(user.id);
      
      if (result.success && result.orderId) {
        setOrderId(result.orderId);
        setOrderStep(2);
        toast.success("Order placed successfully!");
      } else {
        toast.error(result.error || "Failed to process your order");
        setOrderStep(0);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An error occurred during checkout");
      setOrderStep(0);
    }
  };

  if (checkoutStatus === 'success' && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <CheckoutSteps currentStep={2} />
          <div className="bg-white rounded-lg shadow-md p-6">
            <OrderSummary orderId={orderId} />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <EmptyCart />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <CheckoutSteps currentStep={orderStep} />
        
        {checkoutError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {checkoutError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          )}
          
          {!loading && orderStep === 0 && (
            <>
              {items.map((item) => (
                <CartItem
                  key={item.listing_id}
                  item={item}
                  onUpdateQuantity={updateItemQuantity}
                  onRemove={removeItem}
                />
              ))}
              
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Taxes and delivery fees calculated at checkout
                </p>
              </div>
            </>
          )}

          {!loading && orderStep === 1 && (
            <CartSummary items={items} />
          )}
        </div>
        
        <div className="flex justify-between">
          {orderStep === 0 ? (
            <>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Continue Shopping
              </Button>
              
              <div className="space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => clearCart()}
                  className="border-red-200 text-red-500 hover:bg-red-50"
                  disabled={loading}
                >
                  Clear Cart
                </Button>
                
                <Button 
                  onClick={() => setOrderStep(1)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          ) : orderStep === 1 ? (
            <>
              <Button 
                variant="outline"
                onClick={() => setOrderStep(0)}
                disabled={checkoutStatus === 'processing' || loading}
              >
                Back to Cart
              </Button>
              
              <Button 
                onClick={handleCheckout}
                disabled={checkoutStatus === 'processing' || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {checkoutStatus === 'processing' ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Cart;
