
import { Search, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
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
                placeholder="Your location in Hyderabad" 
                className="pl-10 py-6 border-gray-300 rounded-lg shadow-sm" 
                defaultValue="Banjara Hills, Hyderabad"
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
            <Button className="bg-[#FF9933] hover:bg-[#FF8800] py-6 px-8 text-white">
              Find Food
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <span className="text-sm px-4 py-2 bg-[#FF9933]/10 text-[#FF9933] rounded-full">Biryani</span>
          <span className="text-sm px-4 py-2 bg-[#138808]/10 text-[#138808] rounded-full">Hyderabadi Curries</span>
          <span className="text-sm px-4 py-2 bg-[#FF9933]/10 text-[#FF9933] rounded-full">Homemade Sweets</span>
          <span className="text-sm px-4 py-2 bg-[#138808]/10 text-[#138808] rounded-full">Restaurant Surplus</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
