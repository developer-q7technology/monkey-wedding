-- Create the wedding-photos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wedding-photos',
  'wedding-photos',
  true,
  52428800, -- 50MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow public read access (SELECT)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-photos');

-- Policy 2: Allow anyone to upload (INSERT)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'wedding-photos');

-- Policy 3: Allow users to update their own files (optional, for future use)
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'wedding-photos')
WITH CHECK (bucket_id = 'wedding-photos');

-- Policy 4: Allow users to delete (optional, disabled by default)
-- Uncomment if you want to allow deletions
-- CREATE POLICY "Allow public deletes"
-- ON storage.objects FOR DELETE
-- TO public
-- USING (bucket_id = 'wedding-photos');
