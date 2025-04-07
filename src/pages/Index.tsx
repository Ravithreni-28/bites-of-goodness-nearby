
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FoodCard from '@/components/FoodCard';
import SearchBar from '@/components/SearchBar';
import FoodListingForm from '@/components/FoodListingForm';
import { mockFoodListings } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Timer, Info } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("nearby");
  
  const handleSearch = (query: string) => {
    toast({
      title: "Search initiated",
      description: `Searching for: ${query || "all food"}`,
    });
  };
  
  const handleListingSubmit = (data: any) => {
    toast({
      title: "Food listing created!",
      description: "Your food listing has been successfully created.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <section className="container mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Available Food Near You</h2>
            <div className="flex items-center gap-2">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="nearby" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  <TabsTrigger value="free">Free</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
                <FoodListingForm onSubmit={handleListingSubmit} />
              </div>
              
              <TabsContent value="nearby" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFoodListings
                    .sort((a, b) => a.location.distance - b.location.distance)
                    .map((listing, index) => (
                      <FoodCard 
                        key={listing.id} 
                        listing={listing} 
                        featured={index === 0}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="free" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFoodListings
                    .filter(listing => listing.price === null)
                    .map((listing) => (
                      <FoodCard key={listing.id} listing={listing} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFoodListings
                    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
                    .map((listing) => (
                      <FoodCard key={listing.id} listing={listing} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        <section className="bg-gray-50 py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center mb-4">
                  <Timer className="h-8 w-8 text-eco-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">List Your Food</h3>
                <p className="text-gray-600">Take a photo and add details about your excess food. Set a price or offer it for free.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="w-16 h-16 bg-food-orange/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-food-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Locally</h3>
                <p className="text-gray-600">Find or provide food in your neighborhood. Build community connections through food sharing.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center mb-4">
                  <Info className="h-8 w-8 text-eco-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
                <p className="text-gray-600">Help create a sustainable community by reducing food waste and carbon emissions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-eco-green-light">Zero</span>
                <span className="text-food-orange-light">Waste</span>
                <span className="text-eco-green-light">Bites</span>
              </h3>
              <p className="text-gray-300">
                Connecting communities through food sharing, reducing waste one meal at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Food Safety</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Community Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect With Us</h4>
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
