
import React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  orderId: string;
}

export const OrderSummary = ({ orderId }: OrderSummaryProps) => (
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
