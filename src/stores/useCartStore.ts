
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  listing_id: string;
  quantity: number;
  title: string;
  price: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (listingId: string, title: string, price: number) => Promise<void>;
  removeItem: (listingId: string) => Promise<void>;
  updateQuantity: (listingId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          listing_id,
          quantity,
          food_listings (
            title,
            price
          )
        `)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      const cartItems = data.map(item => ({
        id: item.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        title: item.food_listings.title,
        price: item.food_listings.price
      }));

      set({ items: cartItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (listingId, title, price) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: session.session.user.id,
          listing_id: listingId,
          quantity: 1
        })
        .select()
        .single();

      if (error) throw error;

      const newItem = {
        id: data.id,
        listing_id: listingId,
        quantity: 1,
        title,
        price
      };

      set({ items: [...get().items, newItem] });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  },

  removeItem: async (listingId) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      set({ items: get().items.filter(item => item.listing_id !== listingId) });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  },

  updateQuantity: async (listingId, quantity) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('listing_id', listingId)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      set({
        items: get().items.map(item =>
          item.listing_id === listingId ? { ...item, quantity } : item
        )
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },

  clearCart: () => set({ items: [] })
}));
