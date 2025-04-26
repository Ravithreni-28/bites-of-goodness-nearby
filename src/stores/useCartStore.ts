
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

type CartStore = {
  items: CartItem[];
  loading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveCartToDatabase: (userId: string) => Promise<void>;
  loadCartFromDatabase: (userId: string) => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  
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
      await supabase.from('cart_items').delete().eq('user_id', userId);
      
      // Now add the current items
      const { items } = get();
      
      if (items.length > 0) {
        const cartItems: CartItemDB[] = items.map(item => ({
          user_id: userId,
          listing_id: item.listing_id,
          quantity: item.quantity
        }));
        
        const { error } = await supabase.from('cart_items').insert(cartItems);
        
        if (error) throw error;
        
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
          food_listings(id, title, price, image_url)
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
  }
}));
