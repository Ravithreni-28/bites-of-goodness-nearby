
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { MinusIcon, PlusIcon, TrashIcon, Check, ShoppingCart, CreditCard, Package } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const CheckoutSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Review Cart" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Payment" },
    { icon: <Package className="h-5 w-5" />, label: "Order Placed" }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center ${index <= currentStep ? "text-green-600" : "text-gray-400"}`}>
            <div className={`rounded-full p-2 ${index <= currentStep ? "bg-green-100" : "bg-gray-100"}`}>
              {index < currentStep ? <Check className="h-5 w-5" /> : step.icon}
            </div>
            <span className="text-xs mt-1">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderSummary = ({ orderId }: { orderId: string }) => (
  <div className="text-center p-8 max-w-md mx-auto">
    <div className="mb-4 flex justify-center">
      <div className="rounded-full bg-green-100 p-3">
        <Check className="h-8 w-8 text-green-600" />
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-4 text-green-600">Order Placed Successfully!</h2>
    <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
    <p className="text-gray-600 mb-6">Your order ID: <span className="font-semibold">{orderId}</span></p>
    <div className="space-y-3">
      <Button onClick={() => window.location.href = '/transactions'} className="w-full bg-green-600 hover:bg-green-700">
        View Order Details
      </Button>
      <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
        Continue Shopping
      </Button>
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
    <div className="text-center p-8 max-w-md mx-auto">
      <div className="mb-6 text-gray-300 flex justify-center">
        <ShoppingCart className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Button onClick={() => window.location.href = '/'} className="bg-green-600 hover:bg-green-700">
        Browse Food Listings
      </Button>
    </div>
  </div>
);

const Cart = () => {
  const { 
    items, 
    removeItem, 
    updateItemQuantity, 
    clearCart, 
    processCheckout,
    checkoutStatus,
    checkoutError,
    resetCheckoutStatus
  } = useCartStore();
  const [orderStep, setOrderStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset checkout status when component unmounts
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
      toast.error("You need to sign in to complete your purchase");
      navigate('/login');
      return;
    }

    setOrderStep(1); // Move to payment step

    try {
      const result = await processCheckout(user.id);
      
      if (result.success && result.orderId) {
        setOrderId(result.orderId);
        setOrderStep(2); // Move to complete step
        
        // Analytics event could be tracked here
        console.log('Checkout completed successfully', { orderId: result.orderId });
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "There was a problem processing your order");
      setOrderStep(0); // Reset back to cart step
    }
  };

  // If checkout is complete, show order summary
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
          {orderStep === 0 && (
            <>
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
            </>
          )}

          {orderStep === 1 && (
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.listing_id} className="flex justify-between">
                    <span>{item.title} (x{item.quantity})</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-medium text-lg mb-8">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-600">
                  By placing your order, you agree to Zero Waste Bites' terms and conditions.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          {orderStep === 0 ? (
            <>
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
                  onClick={() => setOrderStep(1)}
                  className="bg-green-600 hover:bg-green-700"
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
              >
                Back to Cart
              </Button>
              
              <Button 
                onClick={handleCheckout}
                disabled={checkoutStatus === 'processing'}
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
