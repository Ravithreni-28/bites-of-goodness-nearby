
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
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
}

export const ProfileBadge = ({ 
  isLoggedIn = false, 
  userName = "Guest User", 
  userAvatar 
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
          <p className="text-xs text-muted-foreground">example@email.com</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/dashboard">
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <Link to="/dashboard?tab=myListings">
          <DropdownMenuItem>My Listings</DropdownMenuItem>
        </Link>
        <Link to="/dashboard?tab=saved">
          <DropdownMenuItem>Saved Items</DropdownMenuItem>
        </Link>
        <Link to="/dashboard?tab=messages">
          <DropdownMenuItem>Messages</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileBadge;
