
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Loader2, ShoppingBag, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [buyingTransactions, setBuyingTransactions] = useState<any[]>([]);
  const [sellingTransactions, setSellingTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        // For now, we'll use chats as our transactions
        
        // Fetch buying transactions
        const { data: buyingData, error: buyingError } = await supabase
          .from('chats')
          .select(`
            *,
            food_listings(*),
            seller:seller_id(username, full_name, avatar_url)
          `)
          .eq('buyer_id', user.id);
          
        if (buyingError) throw buyingError;
        setBuyingTransactions(buyingData || []);
        
        // Fetch selling transactions
        const { data: sellingData, error: sellingError } = await supabase
          .from('chats')
          .select(`
            *,
            food_listings(*),
            buyer:buyer_id(username, full_name, avatar_url)
          `)
          .eq('seller_id', user.id);
          
        if (sellingError) throw sellingError;
        setSellingTransactions(sellingData || []);
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transaction history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>
        
        <Tabs defaultValue="buying" className="space-y-6">
          <TabsList>
            <TabsTrigger value="buying">Purchases</TabsTrigger>
            <TabsTrigger value="selling">Sales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buying" className="space-y-4">
            {buyingTransactions.length > 0 ? (
              buyingTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-lg">{transaction.food_listings?.title || 'Food Item'}</h3>
                      </div>
                      <p className="text-gray-500 mb-2">
                        Seller: {transaction.seller?.full_name || transaction.seller?.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Started on {format(new Date(transaction.created_at), 'PPP')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={() => navigate(`/listing/${transaction.food_listings.id}`)}
                      >
                        View Listing
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 flex items-center"
                        onClick={() => navigate('/messages', { state: { chatId: transaction.id } })}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No purchase history</h3>
                <p className="text-gray-500 mb-6">You haven't purchased any food items yet</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/')}
                >
                  Browse Listings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="selling" className="space-y-4">
            {sellingTransactions.length > 0 ? (
              sellingTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-lg">{transaction.food_listings?.title || 'Food Item'}</h3>
                      </div>
                      <p className="text-gray-500 mb-2">
                        Buyer: {transaction.buyer?.full_name || transaction.buyer?.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Started on {format(new Date(transaction.created_at), 'PPP')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center"
                        onClick={() => navigate(`/listing/${transaction.food_listings.id}`)}
                      >
                        View Listing
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 flex items-center"
                        onClick={() => navigate('/messages', { state: { chatId: transaction.id } })}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No sales history</h3>
                <p className="text-gray-500 mb-6">You haven't sold any food items yet</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/create-listing')}
                >
                  Create Listing
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TransactionHistory;
