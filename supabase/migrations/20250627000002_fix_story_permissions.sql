-- Migration: Fix Story Permissions and Delete Function
-- Description: This migration corrects the function used for deleting storage objects
-- and adds the necessary RLS policy to allow users to view story media.
-- Author: SnapConnect Team
-- Date: 2025-06-27

-- ============================================================================
-- 1. FIX delete_story DATABASE FUNCTION
-- ============================================================================
-- Re-creating the function with the correct storage object deletion method.
CREATE OR REPLACE FUNCTION public.delete_story(p_story_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_story_author_id UUID;
    v_storage_path TEXT;
BEGIN
    -- First, get the author_id and storage_path for the story.
    -- This also implicitly checks if the story exists.
    SELECT author_id, storage_path INTO v_story_author_id, v_storage_path
    FROM public.stories
    WHERE id = p_story_id;

    -- If no story was found, raise an exception.
    IF v_story_author_id IS NULL THEN
        RAISE EXCEPTION 'Story not found: %', p_story_id;
    END IF;

    -- Security Check: Ensure the person calling the function is the author of the story.
    IF auth.uid() != v_story_author_id THEN
        RAISE EXCEPTION 'Authorization error: You are not the author of this story.';
    END IF;

    -- Delete the story record from the database.
    -- Due to `ON DELETE CASCADE` on `story_views`, related views will be deleted automatically.
    DELETE FROM public.stories WHERE id = p_story_id;

    -- If a storage path exists, remove the associated file from storage.
    IF v_storage_path IS NOT NULL THEN
        -- Using the correct `delete_objects` function.
        PERFORM storage.delete_objects(ARRAY[v_storage_path]);
    END IF;
END;
$$;

-- ============================================================================
-- 2. ADD RLS POLICY FOR STORY MEDIA STORAGE
-- ============================================================================
-- This policy allows users to view media if it's part of a story they have access to.
DROP POLICY IF EXISTS "Allow authenticated users to view story media" ON storage.objects;

CREATE POLICY "Allow authenticated users to view story media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  (
    -- The user is the author of the story, so they can see their own media.
    owner = auth.uid() OR
    -- OR: The story is public and not expired.
    EXISTS (
      SELECT 1
      FROM public.stories s
      WHERE s.storage_path = name
        AND s.privacy = 'public'
        AND s.created_at > (now() - interval '24 hours')
    ) OR
    -- OR: The story is private, not expired, and the viewer is an accepted friend of the author.
    EXISTS (
      SELECT 1
      FROM public.stories s
      JOIN public.friendships f ON (s.author_id = f.user_id_1 AND f.user_id_2 = auth.uid()) OR (s.author_id = f.user_id_2 AND f.user_id_1 = auth.uid())
      WHERE s.storage_path = name
        AND s.privacy = 'private_friends'
        AND s.created_at > (now() - interval '24 hours')
        AND f.status = 'accepted'
    )
  )
); 