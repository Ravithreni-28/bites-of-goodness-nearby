
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from 'lucide-react';
import { toast } from "sonner";

interface ImageUploadProps {
  selectedImage: File | null;
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  onClearImage: () => void;
}

export const ImageUpload = ({ 
  selectedImage, 
  imagePreview, 
  onImageChange, 
  onClearImage 
}: ImageUploadProps) => {
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Maximum size is 5MB.');
        return;
      }
      
      onImageChange(file);
    }
  };

  return (
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
              onClick={onClearImage}
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
  );
};
