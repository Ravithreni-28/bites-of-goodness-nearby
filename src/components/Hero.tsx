
import { Search, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-eco-green/10 to-food-orange/10 py-10 px-4 md:py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="text-eco-green">Rescue</span> food, 
          <span className="text-food-orange"> Save</span> money, 
          <span className="text-eco-green"> Build</span> community
        </h1>
        
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
          Connect with your neighbors to buy, sell, or donate excess food. 
          Reduce waste, save money, and build a more sustainable community.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6 md:mb-0">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Your location" 
                className="pl-10 py-6 border-gray-300 rounded-lg shadow-sm" 
                defaultValue="Brooklyn, NY"
              />
            </div>
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search for food..." 
                className="pl-10 py-6 border-gray-300 rounded-lg shadow-sm" 
              />
            </div>
            <Button className="bg-eco-green hover:bg-eco-green-dark py-6 px-8">
              Find Food
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="text-sm px-4 py-2 bg-eco-green/10 text-eco-green-dark rounded-full">Homemade meals</span>
          <span className="text-sm px-4 py-2 bg-eco-green/10 text-eco-green-dark rounded-full">Bakery extras</span>
          <span className="text-sm px-4 py-2 bg-eco-green/10 text-eco-green-dark rounded-full">Garden produce</span>
          <span className="text-sm px-4 py-2 bg-eco-green/10 text-eco-green-dark rounded-full">Restaurant surplus</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
