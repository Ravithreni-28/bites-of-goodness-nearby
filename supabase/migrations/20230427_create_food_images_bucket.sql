
-- Create food_images bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'food_images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('food_images', 'Food Images', true);

    -- Set up RLS policy to allow users to upload images
    CREATE POLICY "Anyone can view food images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'food_images');

    CREATE POLICY "Authenticated users can upload food images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'food_images');
    
    CREATE POLICY "Users can update their own food images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'food_images' AND owner = auth.uid());
    
    CREATE POLICY "Users can delete their own food images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'food_images' AND owner = auth.uid());
  END IF;
END $$;
