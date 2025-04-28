
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodCard from '@/components/FoodCard';
import { useAuth } from '@/contexts/AuthContext';
import FoodListingForm from '@/components/FoodListingForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const FoodListings = ({ userLocation, searchQuery }: { userLocation: string, searchQuery: string }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const foodCategories = [
    "All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", 
    "Vegetarian", "Non-vegetarian", "Spicy"
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('food_listings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Process listings to match the expected format
      const processedListings = data?.map(item => {
        return {
          ...item,
          imageUrl: item.image_url || '/placeholder.svg',
          // Format location as expected by FoodCard
          location: {
            display: item.location || 'Unknown location',
            distance: '1.2' // Default distance since we don't have actual location data
          },
          // Set postedAt to the created_at date
          postedAt: new Date(item.created_at),
          // Create seller object from profiles
          seller: {
            name: item.profiles?.full_name || 'Unknown',
            avatar: item.profiles?.avatar_url || '/placeholder.svg',
            rating: '4.5', // Default rating
            phone: ''
          },
          // Default empty arrays for dietary and tags if they don't exist
          dietary: [],
          tags: []
        };
      }) || [];
      
      setListings(processedListings);
    } catch (error: any) {
      console.error('Error fetching listings:', error.message);
      toast.error('Failed to load food listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings
    .filter(listing => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower) ||
          listing.category.toLowerCase().includes(searchLower) ||
          (typeof listing.location === 'string' 
            ? listing.location.toLowerCase().includes(searchLower)
            : listing.location.display.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(listing => {
      if (!selectedCategory || selectedCategory === "All") return true;
      
      if (selectedCategory === "Vegetarian" || 
          selectedCategory === "Non-vegetarian" || 
          selectedCategory === "Spicy") {
        // For these special cases, check if the category matches directly
        return listing.category.toLowerCase() === selectedCategory.toLowerCase();
      }
      
      // For other categories, check if listing.category includes it
      return listing.category.toLowerCase() === selectedCategory.toLowerCase();
    });

  const getSortedListings = () => {
    switch (activeTab) {
      case "nearby":
        // Since we don't have actual distance data yet, just return the filtered listings
        // In a real app, we would sort by distance from user location
        return filteredListings;
      case "recent":
        return [...filteredListings].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return filteredListings;
    }
  };

  const sortedListings = getSortedListings();

  const handleListingSubmit = async (formData: any) => {
    await fetchListings(); // Refresh listings after submission
  };

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Food Near You</h2>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{userLocation}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {foodCategories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 text-sm ${selectedCategory === category ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all">All Food</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            {user && <FoodListingForm onSubmit={handleListingSubmit} />}
          </div>
          
          {["all", "nearby", "recent"].map((tab) => (
            <TabsContent key={tab} value={tab} className="pt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(index => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 h-52 mb-3 rounded-lg"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : sortedListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedListings.map((listing, index) => (
                    <FoodCard 
                      key={listing.id} 
                      listing={listing} 
                      featured={index === 0 && tab === "all"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-3">No food listings available at the moment</p>
                  {user ? (
                    <Link to="/create-listing">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Share Your Food
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Log in to Share Food
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FoodListings;
