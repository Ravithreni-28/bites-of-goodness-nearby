
import React from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { CartItem as CartItemType } from "@/stores/useCartStore";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => (
  <div className="flex items-center justify-between py-4 border-b last:border-b-0">
    <div className="flex items-center gap-4">
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt={item.title}
          className="w-16 h-16 object-cover rounded-md"
        />
      )}
      {!item.image_url && (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
          No image
        </div>
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
              onUpdateQuantity(item.listing_id, item.quantity - 1);
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
          onClick={() => onUpdateQuantity(item.listing_id, item.quantity + 1)}
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
        onClick={() => onRemove(item.listing_id)}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  </div>
);
