
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  listing_id: string;
};

interface CartItemDB {
  user_id: string;
  listing_id: string;
  quantity: number;
}

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

type CartStore = {
  items: CartItem[];
  loading: boolean;
  checkoutStatus: CheckoutStatus;
  checkoutError: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveCartToDatabase: (userId: string) => Promise<void>;
  loadCartFromDatabase: (userId: string) => Promise<void>;
  processCheckout: (userId: string) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  resetCheckoutStatus: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  checkoutStatus: 'idle',
  checkoutError: null,
  
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.listing_id === item.listing_id);
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.listing_id === item.listing_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      } else {
        return { items: [...state.items, item] };
      }
    });
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.listing_id !== id),
    }));
  },
  
  updateItemQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.listing_id === id ? { ...item, quantity } : item
      ),
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  saveCartToDatabase: async (userId) => {
    try {
      set({ loading: true });
      
      // First, delete existing cart items for this user
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      // Now add the current items
      const { items } = get();
      
      if (items.length > 0) {
        const cartItems = items.map(item => ({
          user_id: userId,
          listing_id: item.listing_id,
          quantity: item.quantity
        }));
        
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(cartItems);
        
        if (insertError) throw insertError;
        
        toast.success("Cart saved successfully");
      }
    } catch (error: any) {
      console.error('Error saving cart:', error);
      toast.error(`Failed to save cart: ${error.message}`);
    } finally {
      set({ loading: false });
    }
  },
  
  loadCartFromDatabase: async (userId) => {
    try {
      set({ loading: true });
      
      // Clear the current cart first
      set({ items: [] });
      
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          listing_id,
          quantity,
          food_listings (
            id,
            title,
            price,
            image_url
          )
        `)
        .eq('user_id', userId);
      
      if (cartError) throw cartError;
      
      if (cartItems && cartItems.length > 0) {
        const formattedItems: CartItem[] = cartItems.map((item: any) => ({
          id: crypto.randomUUID(),
          listing_id: item.listing_id,
          title: item.food_listings.title,
          price: item.food_listings.price,
          quantity: item.quantity,
          image_url: item.food_listings.image_url
        }));
        
        set({ items: formattedItems });
      }
    } catch (error: any) {
      console.error('Error loading cart:', error);
      toast.error(`Failed to load cart: ${error.message}`);
    } finally {
      set({ loading: false });
    }
  },

  processCheckout: async (userId) => {
    try {
      set({ 
        checkoutStatus: 'processing',
        checkoutError: null
      });

      const { items } = get();
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );

      if (items.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: total,
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!orderData?.id) {
        throw new Error('Failed to create order: No order ID returned');
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        price_per_unit: item.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) {
        throw new Error(`Failed to create order items: ${orderItemsError.message}`);
      }

      // Update food listings status to 'sold'
      for (const item of items) {
        const { error: updateError } = await supabase
          .from('food_listings')
          .update({ status: 'sold' })
          .eq('id', item.listing_id);
        
        if (updateError) {
          console.error(`Failed to update listing status: ${updateError.message}`);
          // Continue with checkout even if status update fails
        }
      }

      // Clear the cart after successful checkout
      get().clearCart();

      // Also remove cart items from database
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      set({ checkoutStatus: 'success' });
      
      return {
        success: true,
        orderId: orderData.id
      };
    } catch (error: any) {
      console.error('Checkout error:', error);
      set({ 
        checkoutStatus: 'error',
        checkoutError: error.message 
      });
      return {
        success: false,
        error: error.message
      };
    }
  },

  resetCheckoutStatus: () => {
    set({ 
      checkoutStatus: 'idle',
      checkoutError: null
    });
  }
}));
