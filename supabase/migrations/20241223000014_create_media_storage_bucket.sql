-- Migration: Create Media Storage Bucket
-- Description: Creates the 'media' storage bucket and sets the RLS policies
-- required for uploading and viewing photos and videos.
-- Author: SnapConnect Team
-- Date: 2024-12-24

-- ============================================================================
-- 1. CREATE MEDIA STORAGE BUCKET
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', FALSE, 52428800, ARRAY['image/jpeg', 'image/png', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. RLS POLICIES FOR MEDIA BUCKET
-- ============================================================================

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated views" ON storage.objects;

-- Allow authenticated users to upload media
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow users to view media only if they are the owner or part of the corresponding chat
CREATE POLICY "Allow authenticated views"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'media' AND
  (
    owner = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.chat_participants cp ON m.chat_id = cp.chat_id
      WHERE m.storage_path = storage.objects.name
      AND cp.user_id = auth.uid()
    )
  )
);
