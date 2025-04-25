
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
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
  );
};

export default Footer;
