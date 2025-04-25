
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodCard from '@/components/FoodCard';
import { useAuth } from '@/contexts/AuthContext';
import FoodListingForm from '@/components/FoodListingForm';
import { mockFoodListings } from '@/utils/mockData';

export const FoodListings = ({ userLocation, searchQuery }: { userLocation: string, searchQuery: string }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const foodCategories = [
    "All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", 
    "Vegetarian", "Non-vegetarian", "Spicy"
  ];

  const filteredListings = mockFoodListings
    .filter(listing => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower) ||
          listing.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          listing.dietary.some(item => item.toLowerCase().includes(searchLower)) ||
          listing.location.display.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(listing => {
      if (!selectedCategory || selectedCategory === "All") return true;
      if (selectedCategory === "Vegetarian") return listing.dietary.includes("Vegetarian");
      if (selectedCategory === "Non-vegetarian") return listing.dietary.includes("Non-vegetarian");
      if (selectedCategory === "Spicy") return listing.dietary.includes("Spicy");
      return listing.tags.some(tag => 
        tag.toLowerCase() === selectedCategory.toLowerCase() || 
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    });

  const getSortedListings = () => {
    switch (activeTab) {
      case "nearby":
        return [...filteredListings].sort((a, b) => a.location.distance - b.location.distance);
      case "recent":
        return [...filteredListings].sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
      default:
        return filteredListings;
    }
  };

  const sortedListings = getSortedListings();

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
            {user && <FoodListingForm onSubmit={() => {}} />}
          </div>
          
          {["all", "nearby", "recent"].map((tab) => (
            <TabsContent key={tab} value={tab} className="pt-6">
              {sortedListings.length > 0 ? (
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
