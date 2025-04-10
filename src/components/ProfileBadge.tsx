
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
        <Button variant="outline" size="sm">
          Log in
        </Button>
        <Button variant="default" size="sm" className="bg-[#FF9933] hover:bg-[#FF8800]">
          Sign up
        </Button>
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
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>My Listings</DropdownMenuItem>
        <DropdownMenuItem>Saved Items</DropdownMenuItem>
        <DropdownMenuItem>Messages</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileBadge;
