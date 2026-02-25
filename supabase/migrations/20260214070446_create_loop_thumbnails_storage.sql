/*
  # Create Loop Thumbnails Storage Bucket

  1. Storage
    - Create `loop-thumbnails` bucket for storing loop thumbnail images
    - Set bucket to public for easy access
  
  2. Security
    - Enable RLS on the storage bucket
    - Allow authenticated users to upload their own thumbnails
    - Allow public read access to all thumbnails
    - Allow creators to update/delete their own thumbnails
*/

-- Create the storage bucket for loop thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('loop-thumbnails', 'loop-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'loop-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all thumbnails
CREATE POLICY "Public can view thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'loop-thumbnails');

-- Allow users to update their own thumbnails
CREATE POLICY "Users can update own thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'loop-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'loop-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete own thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'loop-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);