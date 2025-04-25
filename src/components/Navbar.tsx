import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Menu, Search, User, Plus, X, MessageSquare, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileBadge from './ProfileBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/stores/useCartStore';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { items } = useCartStore();
  
  const isLoggedIn = !!user;
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <span className="text-2xl font-bold">
              <span className="text-[#FF9933]">Zero</span>
              <span className="text-[#138808]">Waste</span>
              <span className="text-[#000080]">Bites</span>
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {profile && (
            <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{profile.address || 'Set your location'}</span>
            </div>
          )}
          <Button variant="outline" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            <span>Search</span>
          </Button>
          <Link to={isLoggedIn ? "/create-listing" : "/login"}>
            <Button variant="default" className="bg-[#FF9933] hover:bg-[#FF8800] flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              <span>Share Food</span>
            </Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          <ProfileBadge 
            isLoggedIn={isLoggedIn} 
            userName={profile?.full_name || ''} 
            userAvatar={profile?.avatar_url || ''}
            onSignOut={handleSignOut}
          />
        </div>
        
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
                    <span className="text-[#FF9933]">Zero</span>
                    <span className="text-[#138808]">Waste</span>
                    <span className="text-[#000080]">Bites</span>
                  </h2>
                </Link>
              </div>
              <div className="space-y-3 px-2">
                {isLoggedIn && (
                  <div className="flex items-center py-2 rounded-md px-2">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{profile?.address || 'Set your location'}</span>
                  </div>
                )}
                <Link to="/search" className="block">
                  <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                    <Search className="h-5 w-5 mr-3" />
                    <span>Search Food</span>
                  </div>
                </Link>
                <Link to={isLoggedIn ? "/create-listing" : "/login"} className="block">
                  <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                    <Plus className="h-5 w-5 mr-3" />
                    <span>Share Food</span>
                  </div>
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="block">
                      <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                        <User className="h-5 w-5 mr-3" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link to="/messages" className="block">
                      <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                        <MessageSquare className="h-5 w-5 mr-3" />
                        <span>Messages</span>
                      </div>
                    </Link>
                    <div 
                      className="flex items-center py-2 hover:bg-muted rounded-md px-2 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <X className="h-5 w-5 mr-3" />
                      <span>Sign Out</span>
                    </div>
                  </>
                ) : (
                  <Link to="/login" className="block">
                    <div className="flex items-center py-2 hover:bg-muted rounded-md px-2">
                      <User className="h-5 w-5 mr-3" />
                      <span>Login / Sign Up</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
