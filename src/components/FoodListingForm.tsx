
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, IndianRupee } from 'lucide-react';
import { dietaryTags, foodTags } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface FoodListingFormProps {
  onSubmit?: (data: any) => void;
  children?: React.ReactNode;
}

export const FoodListingForm = ({ onSubmit, children }: FoodListingFormProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(100);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('servings');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState(profile?.address || '');
  const [open, setOpen] = useState(false);
  
  const handleDietaryTagToggle = (tag: string) => {
    if (selectedDietary.includes(tag)) {
      setSelectedDietary(selectedDietary.filter(t => t !== tag));
    } else {
      setSelectedDietary([...selectedDietary, tag]);
    }
  };

  const handleFoodTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Maximum size is 5MB.');
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File, listingId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `food/${listingId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('food_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('food_images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a listing');
      navigate('/login');
      return;
    }
    
    if (!title) {
      toast.error('Please enter a food title');
      return;
    }

    if (!description) {
      toast.error('Please enter a description');
      return;
    }

    if (!location) {
      toast.error('Please enter a pickup location');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Combine dietary and food tags for category
      const category = selectedDietary.length > 0 ? selectedDietary[0] : 
                     (selectedTags.length > 0 ? selectedTags[0] : 'Other');

      // Insert listing data
      const { data: listing, error: listingError } = await supabase
        .from('food_listings')
        .insert({
          user_id: user.id,
          title,
          description,
          price,
          category,
          location,
          quantity,
          status: 'available'
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload image if selected
      if (selectedImage && listing) {
        const imageUrl = await uploadImage(selectedImage, listing.id);
        
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from('food_listings')
            .update({ image_url: imageUrl })
            .eq('id', listing.id);
          
          if (updateError) {
            console.error('Error updating listing with image URL:', updateError);
          }
        }
      }

      toast.success('Food listing created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice(100);
      setQuantity(1);
      setUnit('servings');
      setSelectedDietary([]);
      setSelectedTags([]);
      clearSelectedImage();
      
      // Close dialog
      setOpen(false);
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(listing);
      }
    } catch (error: any) {
      console.error('Error creating food listing:', error);
      toast.error(error.message || 'Failed to create food listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Share Food
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Extra Food</DialogTitle>
          <DialogDescription>
            List your excess food to sell to others in your community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="food-photo">Food Photo</Label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/80 shadow-sm hover:bg-white"
                    onClick={clearSelectedImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('food-photo')?.click()}
                >
                  <Camera className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">JPG, PNG or JPEG (max. 5MB)</p>
                </div>
              )}
              <input 
                id="food-photo" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Food Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Homemade Chicken Biryani" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your food, its condition, when it was made, etc."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                placeholder="e.g., 2" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servings">Servings</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="handi">Handi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="price" className="flex items-center">
                <span>Price: </span>
                <IndianRupee className="h-3.5 w-3.5 mx-1" />
                <span>{price.toFixed(0)}</span>
              </Label>
            </div>
            <Slider
              id="price"
              min={0}
              max={1000}
              step={10}
              value={[price]}
              onValueChange={(value) => setPrice(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dietary Information</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {dietaryTags.map((tag) => (
                <Badge 
                  key={tag}
                  variant={selectedDietary.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    selectedDietary.includes(tag) 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "hover:bg-green-100"
                  }`}
                  onClick={() => handleDietaryTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Food Tags</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {foodTags.map((tag) => (
                <Badge 
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer capitalize ${
                    selectedTags.includes(tag) 
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "hover:bg-indigo-100"
                  }`}
                  onClick={() => handleFoodTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Pickup Address</Label>
            <Input 
              placeholder="Your address in Hyderabad" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Only your neighborhood will be shown publicly. Exact address will be shared only with accepted buyers.
            </p>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </div>
              ) : (
                'List Food'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodListingForm;
