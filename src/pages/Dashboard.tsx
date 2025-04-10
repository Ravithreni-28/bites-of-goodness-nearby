
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, List, MessageSquare, Star, Clock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import FoodListingForm from '@/components/FoodListingForm';
import { useToast } from '@/hooks/use-toast';
import { mockFoodListings } from '@/utils/mockData';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("myListings");
  
  // Mock user data - would come from auth context
  const user = {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9876543210",
    address: "Banjara Hills, Hyderabad",
    joinedDate: "January 2025",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };
  
  // Filter listings to show only user's listings (mock implementation)
  const userListings = mockFoodListings.slice(0, 3);
  
  const handleCreateListing = (data: any) => {
    toast({
      title: "Food listing created!",
      description: "Your food listing has been successfully created.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User profile sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-24 h-24 mb-4 relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>Member since {user.joinedDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.address}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <FoodListingForm onSubmit={handleCreateListing} />
            </div>
            
            <Tabs defaultValue="myListings" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="myListings">
                  <List className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="saved">
                  <Star className="h-4 w-4 mr-2" />
                  Saved Items
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="myListings">
                {userListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map(listing => (
                      <FoodCard 
                        key={listing.id} 
                        listing={listing} 
                      />
                    ))}
                    <Card className="flex flex-col items-center justify-center border-dashed p-6 h-full">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4 text-center">Share your extra food with the community</p>
                      <FoodListingForm onSubmit={handleCreateListing}>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Listing
                        </Button>
                      </FoodListingForm>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Active Listings</h3>
                    <p className="text-muted-foreground mb-6">You haven't shared any food items yet</p>
                    <FoodListingForm onSubmit={handleCreateListing}>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Listing
                      </Button>
                    </FoodListingForm>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
                  <p className="text-muted-foreground">You don't have any messages at the moment</p>
                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Saved Items</h3>
                  <p className="text-muted-foreground">You haven't saved any items yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
