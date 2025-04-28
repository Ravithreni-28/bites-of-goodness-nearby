
import React from 'react';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyCart = () => (
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
