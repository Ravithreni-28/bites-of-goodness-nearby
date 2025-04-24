
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, User, Clock, MessageSquare, IndianRupee, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const ListingDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initiatingTransaction, setInitiatingTransaction] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data: listingData, error: listingError } = await supabase
          .from('food_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (listingError) throw listingError;
        
        setListing(listingData);
        
        if (listingData.user_id) {
          const { data: sellerData, error: sellerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', listingData.user_id)
            .single();
          
          if (sellerError) throw sellerError;
          setSeller(sellerData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, toast]);

  const initiateTransaction = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to initiate a transaction",
      });
      navigate('/login');
      return;
    }

    setInitiatingTransaction(true);
    try {
      // Create a chat if it doesn't exist
      const { data: existingChat, error: chatCheckError } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', user.id)
        .eq('seller_id', listing.user_id)
        .single();

      let chatId;
      
      if (chatCheckError) {
        // Create a new chat
        const { data: newChat, error: createChatError } = await supabase
          .from('chats')
          .insert({
            listing_id: listing.id,
            buyer_id: user.id, 
            seller_id: listing.user_id
          })
          .select('id')
          .single();
        
        if (createChatError) throw createChatError;
        chatId = newChat.id;
        
        // Add initial message
        await supabase
          .from('messages')
          .insert({
            chat_id: chatId,
            sender_id: user.id,
            content: `Hi! I'm interested in your "${listing.title}" listing.`
          });
      } else {
        chatId = existingChat.id;
      }
      
      toast({
        title: "Transaction Initiated",
        description: "You can now message the seller",
      });
      
      navigate('/messages', { state: { chatId } });
    } catch (error) {
      console.error('Error initiating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to initiate transaction",
        variant: "destructive",
      });
    } finally {
      setInitiatingTransaction(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-48 mt-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentUserSeller = user && user.id === listing.user_id;
  const listingExpired = listing.expiry_date && new Date(listing.expiry_date) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {listing.image_url ? (
            <div className="relative h-72 md:h-96 w-full bg-gray-100">
              <img 
                src={listing.image_url} 
                alt={listing.title} 
                className="w-full h-full object-cover"
              />
              {listingExpired && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-sm py-1 px-3">Expired</Badge>
                </div>
              )}
              {!listingExpired && listing.status !== 'available' && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-sm py-1 px-3 capitalize">{listing.status}</Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="h-72 md:h-96 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{listing.title}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{listing.location}</span>
                </div>
              </div>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <IndianRupee className="h-5 w-5 text-blue-700" />
                <span className="text-xl font-bold text-blue-700">
                  {listing.price === 0 ? 'Free' : `${listing.price}`}
                </span>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="md:flex md:justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h2 className="font-semibold text-lg mb-3 text-gray-800">Description</h2>
                <p className="text-gray-700 whitespace-pre-line mb-4">{listing.description}</p>
                
                <h2 className="font-semibold text-lg mb-3 text-gray-800 mt-6">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Listed on {format(new Date(listing.created_at), 'PPP')}</span>
                  </div>
                  
                  {listing.expiry_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Expires on {format(new Date(listing.expiry_date), 'PPP')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">{listing.category}</Badge>
                    {listing.quantity > 1 && (
                      <span className="text-sm">× {listing.quantity}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Offered by</h3>
                {seller ? (
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={seller.avatar_url} alt={seller.full_name} />
                      <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{seller.full_name}</p>
                      <p className="text-sm text-gray-500">@{seller.username}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Loading...</p>
                    </div>
                  </div>
                )}
                
                {!isCurrentUserSeller ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                      disabled={initiatingTransaction || listingExpired || listing.status !== 'available'}
                      onClick={initiateTransaction}
                    >
                      {initiatingTransaction ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Contact Seller
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/map/${listing.id}`)}
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      View on Map
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                    >
                      Manage Your Listing
                    </Button>
                  </div>
                )}
                
                {(listingExpired || listing.status !== 'available') && !isCurrentUserSeller && (
                  <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                    {listingExpired ? 
                      "This listing has expired and is no longer available." : 
                      `This listing is currently ${listing.status}.`
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
