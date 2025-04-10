
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Menu, Search, User, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileBadge from './ProfileBadge';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock authentication status - would come from auth context
  const isLoggedIn = false;
  
  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <span className="text-2xl font-bold">
              <span className="text-[#FF9933]">Apna</span>
              <span className="text-[#138808]">Khana</span>
              <span className="text-[#000080]">Share</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Hyderabad, Telangana</span>
          </div>
          <Button variant="outline" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            <span>Search</span>
          </Button>
          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            <Button variant="default" className="bg-[#FF9933] hover:bg-[#FF8800] flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              <span>Share Food</span>
            </Button>
          </Link>
          <ProfileBadge isLoggedIn={isLoggedIn} />
        </div>
        
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <div className="py-6 space-y-6">
              <div className="px-2">
                <Link to="/">
                  <h2 className="text-xl font-bold mb-2">
                    <span className="text-[#FF9933]">Apna</span>
                    <span className="text-[#138808]">Khana</span>
                    <span className="text-[#000080]">Share</span>
                  </h2>
                </Link>
              </div>
              <div className="space-y-3 px-2">
                <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Change Location</span>
                </div>
                <Link to="/search" className="block">
                  <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                    <Search className="h-5 w-5 mr-3" />
                    <span>Search Food</span>
                  </div>
                </Link>
                <Link to={isLoggedIn ? "/dashboard" : "/login"} className="block">
                  <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                    <Plus className="h-5 w-5 mr-3" />
                    <span>Share Food</span>
                  </div>
                </Link>
                <Link to={isLoggedIn ? "/dashboard" : "/login"} className="block">
                  <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                    <User className="h-5 w-5 mr-3" />
                    <span>{isLoggedIn ? "Dashboard" : "Login / Sign Up"}</span>
                  </div>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
