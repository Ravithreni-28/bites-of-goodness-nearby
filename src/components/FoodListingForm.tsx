import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus } from 'lucide-react';
import { dietaryTags, foodTags } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { ImageUpload } from './food-listing/ImageUpload';
import { TagSelector } from './food-listing/TagSelector';
import { PriceField } from './food-listing/PriceField';
import { QuantityUnitFields } from './food-listing/QuantityUnitFields';

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
    setSelectedDietary(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFoodTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
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
    
    if (!title || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const category = selectedDietary.length > 0 ? selectedDietary[0] : 
                     (selectedTags.length > 0 ? selectedTags[0] : 'Other');

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
      
      setTitle('');
      setDescription('');
      setPrice(100);
      setQuantity(1);
      setUnit('servings');
      setSelectedDietary([]);
      setSelectedTags([]);
      clearSelectedImage();
      setOpen(false);
      
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
          <ImageUpload
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onClearImage={clearSelectedImage}
          />
          
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
          
          <QuantityUnitFields
            quantity={quantity}
            unit={unit}
            onQuantityChange={setQuantity}
            onUnitChange={setUnit}
          />
          
          <PriceField
            price={price}
            onPriceChange={(value) => setPrice(value[0])}
          />
          
          <TagSelector
            label="Dietary Information"
            tags={dietaryTags}
            selectedTags={selectedDietary}
            onTagToggle={handleDietaryTagToggle}
          />
          
          <TagSelector
            label="Food Tags"
            tags={foodTags}
            selectedTags={selectedTags}
            onTagToggle={handleFoodTagToggle}
            badgeClassName="bg-indigo-600 hover:bg-indigo-700"
          />
          
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
