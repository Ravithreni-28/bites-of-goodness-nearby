
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, PlusCircle, MessageSquare, ShoppingBag, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileBadgeProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  onSignOut?: () => void;
}

export const ProfileBadge = ({ 
  isLoggedIn = false, 
  userName = "Guest User", 
  userAvatar,
  onSignOut
}: ProfileBadgeProps) => {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="default" size="sm" className="bg-[#FF9933] hover:bg-[#FF8800]">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="font-medium">{userName}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/dashboard">
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" /> Dashboard
          </DropdownMenuItem>
        </Link>
        <Link to="/create-listing">
          <DropdownMenuItem>
            <PlusCircle className="h-4 w-4 mr-2" /> Share Food
          </DropdownMenuItem>
        </Link>
        <Link to="/messages">
          <DropdownMenuItem>
            <MessageSquare className="h-4 w-4 mr-2" /> Messages
          </DropdownMenuItem>
        </Link>
        <Link to="/saved">
          <DropdownMenuItem>
            <Heart className="h-4 w-4 mr-2" /> Saved Items
          </DropdownMenuItem>
        </Link>
        <Link to="/transactions">
          <DropdownMenuItem>
            <ShoppingBag className="h-4 w-4 mr-2" /> Transactions
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/settings">
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileBadge;
