-- Migration: Consolidate Storage RLS Policies
-- Description: This migration drops all previous SELECT policies on storage.objects
-- and creates a single, authoritative policy to handle all media access rules.
-- Author: SnapConnect Team
-- Date: 2025-06-27

-- ============================================================================
-- 1. DROP ALL PREVIOUS SELECT POLICIES
-- ============================================================================
-- Drop all previous, potentially conflicting SELECT policies on the media bucket.
DROP POLICY IF EXISTS "Allow authenticated read access to media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view story media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated views" ON storage.objects;
DROP POLICY IF EXISTS "Allow access to media in user's chats" ON storage.objects;

-- ============================================================================
-- 2. CREATE CONSOLIDATED RLS POLICY FOR MEDIA STORAGE
-- ============================================================================
-- Create a single, authoritative policy for viewing all media.
CREATE POLICY "Allow authenticated read access to media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  (
    -- Case 1: The user is the owner (creator) of the media file.
    owner = auth.uid()
    OR
    -- Case 2: The media is part of a chat message in a conversation the user is part of.
    EXISTS (
      SELECT 1
      FROM public.messages m
      JOIN public.chat_participants cp ON m.chat_id = cp.chat_id
      WHERE cp.user_id = auth.uid()
      AND m.storage_path = storage.objects.name
    )
    OR
    -- Case 3: The media is part of a story that is public and not expired.
    EXISTS (
       SELECT 1
       FROM public.stories s
       WHERE s.storage_path = storage.objects.name
         AND s.privacy = 'public'
         AND s.created_at > (now() - interval '24 hours')
    )
    OR
    -- Case 4: The media is part of a private story from a friend, and it's not expired.
    EXISTS (
      SELECT 1
      FROM public.stories s
      -- This join correctly finds if the story's author and the current user are friends.
      JOIN public.friendships f ON (s.author_id = f.user_id_1 AND f.user_id_2 = auth.uid()) OR (s.author_id = f.user_id_2 AND f.user_id_1 = auth.uid())
      WHERE s.storage_path = storage.objects.name
        AND s.privacy = 'private_friends'
        AND f.status = 'accepted'
        AND s.created_at > (now() - interval '24 hours')
    )
  )
); 