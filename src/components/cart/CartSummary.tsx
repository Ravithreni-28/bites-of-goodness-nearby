
import React from 'react';
import { CartItem as CartItemType } from "@/stores/useCartStore";
import { formatCurrency } from "@/utils/format";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  items: CartItemType[];
}

export const CartSummary = ({ items }: CartSummaryProps) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  return (
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
  );
};
