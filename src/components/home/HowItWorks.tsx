
import { Timer, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

export const HowItWorks = () => {
  const { user } = useAuth();

  return (
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
  );
};

export default HowItWorks;
