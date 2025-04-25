
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import FoodListings from '@/components/home/FoodListings';
import HowItWorks from '@/components/home/HowItWorks';
import About from '@/components/home/About';
import Footer from '@/components/home/Footer';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>("Hyderabad");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="relative bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 py-10 px-4 md:py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="text-[#FF9933]">Share</span> Food, 
              <span className="text-[#138808]"> Save</span> Money, 
              <span className="text-[#138808]"> Connect</span> Hyderabad
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
              Join the community of Hyderabadis sharing homemade biryani, curries, and more. 
              Reduce food waste, save money, and build a more sustainable Hyderabad.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6 md:mb-0">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="text" 
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    className="pl-10 py-6 border-gray-300 rounded-lg shadow-sm" 
                    placeholder="Your location in Hyderabad"
                  />
                </div>
                <SearchBar onSearch={handleSearch} additionalClasses="w-full md:w-auto" />
              </div>
            </div>
            
            <div className="mt-10">
              <Link to="/register">
                <Button className="bg-[#138808] hover:bg-[#0A6A3B] text-white px-8 py-3 text-lg rounded-lg shadow-md mr-4">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933]/10 px-8 py-3 text-lg rounded-lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <FoodListings userLocation={userLocation} searchQuery={searchQuery} />
        <HowItWorks />
        <About />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
