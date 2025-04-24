
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import SearchBar from '@/components/SearchBar';
import FoodListingForm from '@/components/FoodListingForm';
import { mockFoodListings } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Timer, IndianRupee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>("Hyderabad");

  // Request location access on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode to get location name
          // For now we'll just use coordinates
          setUserLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast({
      title: "Search initiated",
      description: `Searching for food near ${userLocation}`,
    });
  };

  const handleListingSubmit = (data: any) => {
    toast({
      title: "Food listing created!",
      description: "Your food listing has been successfully created.",
    });
  };

  const foodCategories = [
    "All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Vegetarian", "Non-vegetarian", "Spicy"
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto py-16 px-4 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Share Food, Save Money, Build Community
              </h1>
              
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Join our community reducing food waste while connecting neighbors through delicious homemade meals.
              </p>
              
              <div className="relative max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 mb-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="relative flex-grow mb-3 md:mb-0">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      className="w-full pl-10 py-3 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="Your location in Hyderabad"
                    />
                  </div>
                  <SearchBar onSearch={handleSearch} additionalClasses="w-full md:w-auto" />
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6 mb-6">
                {foodCategories.slice(0, 6).map(category => (
                  <span key={category} className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                {!user ? (
                  <>
                    <Link to="/register">
                      <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-md">
                        Join Our Community
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-lg">
                        Log In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/create-listing">
                    <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg shadow-md">
                      Share Your Food
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Food Listings Section */}
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
              
              <TabsContent value="all" className="pt-6">
                {sortedListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedListings.map((listing, index) => (
                      <FoodCard 
                        key={listing.id} 
                        listing={listing} 
                        featured={index === 0 && activeTab === "all"}
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
              
              <TabsContent value="nearby" className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedListings.map((listing, index) => (
                    <FoodCard 
                      key={listing.id} 
                      listing={listing} 
                      featured={index === 0}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedListings.map((listing) => (
                    <FoodCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto text-center max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-xl shadow-sm flex flex-col items-center transform transition duration-300 hover:translate-y-[-5px] hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <Timer className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Share Your Food</h3>
                <p className="text-gray-600">Upload photos of your extra homemade food, set a price or offer it for free, and help reduce food waste.</p>
                <div className="mt-4">
                  <Link to={user ? "/create-listing" : "/register"} className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-xl shadow-sm flex flex-col items-center transform transition duration-300 hover:translate-y-[-5px] hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Connect With Neighbors</h3>
                <p className="text-gray-600">Find food or share food across your neighborhood. Build meaningful connections through food sharing.</p>
                <div className="mt-4">
                  <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                    Browse listings <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-gray-50 to-white p-8 rounded-xl shadow-sm flex flex-col items-center transform transition duration-300 hover:translate-y-[-5px] hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <IndianRupee className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Save Money & Resources</h3>
                <p className="text-gray-600">Access affordable homemade food and help others earn from their cooking skills. Everyone benefits!</p>
                <div className="mt-4">
                  <Link to={user ? "/" : "/login"} className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">About Zero Waste Bites</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="mb-4 text-gray-700">
                Zero Waste Bites is a food rescue and redistribution platform that addresses food waste by connecting individuals who have overcooked or excess food with nearby consumers looking for affordable meal options.
              </p>
              <p className="mb-6 text-gray-700">
                Our mission is to reduce food waste while providing affordable meal options and building community connections. By sharing your excess food, you're not only helping someone enjoy a delicious meal but also contributing to a more sustainable future.
              </p>
              <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Our Objectives:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Reduce food waste in communities",
                  "Provide affordable meal options",
                  "Foster community connections",
                  "Create a sustainable food ecosystem",
                  "Promote resourcefulness",
                  "Support local food sharing"
                ].map((item, index) => (
                  <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Zero Waste Bites
              </h3>
              <p className="text-gray-300">
                Connecting people through food sharing, reducing waste one meal at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-gray-100">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Food Safety</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-gray-100">Connect With Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Zero Waste Bites. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
