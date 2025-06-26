-- Migration: Add Story Management Functions
-- Description: Adds functions to delete stories and get story viewer analytics.
-- Author: SnapConnect Team
-- Date: 2025-06-27

-- ============================================================================
-- 1. CREATE delete_story DATABASE FUNCTION
-- ============================================================================
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
        -- The storage function `delete_object` was deprecated in favor of `remove`.
        PERFORM storage.remove(ARRAY[v_storage_path]);
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_story(BIGINT) TO authenticated;

-- ============================================================================
-- 2. CREATE get_story_viewers DATABASE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_story_viewers(p_story_id BIGINT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER -- Use invoker and check permissions inside.
AS $$
DECLARE
    v_story_author_id UUID;
BEGIN
    -- Check if the story exists and get its author.
    SELECT author_id INTO v_story_author_id
    FROM public.stories
    WHERE id = p_story_id;

    -- If story not found, return null or empty object.
    IF v_story_author_id IS NULL THEN
        RETURN json_build_object('view_count', 0, 'viewers', '[]'::json);
    END IF;

    -- Security Check: Only the author can see who viewed the story.
    IF auth.uid() != v_story_author_id THEN
        RAISE EXCEPTION 'Authorization error: You are not the author of this story.';
    END IF;

    -- If authorized, build and return the JSON response.
    RETURN (
        SELECT json_build_object(
            'view_count', COUNT(sv.user_id),
            'viewers', COALESCE(json_agg(
                json_build_object(
                    'user_id', p.id,
                    'username', p.username,
                    'viewed_at', sv.viewed_at
                ) ORDER BY sv.viewed_at DESC
            ), '[]'::json)
        )
        FROM public.story_views sv
        JOIN public.profiles p ON sv.user_id = p.id
        WHERE sv.story_id = p_story_id
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_story_viewers(BIGINT) TO authenticated;

-- ============================================================================
-- 3. ADD/UPDATE RLS POLICIES FOR MEDIA STORAGE
-- ============================================================================
-- This policy allows users to view media if it's part of a story they have access to.
-- This is critical for both public stories and private stories shared with friends.

CREATE POLICY "Allow authenticated users to view story media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'media' AND
  (
    -- The user is the author of the story
    owner = auth.uid() OR
    -- The story is public and less than 24 hours old
    EXISTS (
      SELECT 1
      FROM public.stories s
      WHERE s.storage_path = name
        AND s.privacy = 'public'
        AND s.created_at > (now() - interval '24 hours')
    ) OR
    -- The story is private, less than 24 hours old, and the viewer is a friend
    EXISTS (
      SELECT 1
      FROM public.stories s
      JOIN public.friendships f ON s.author_id = f.user_id_1 OR s.author_id = f.user_id_2
      WHERE s.storage_path = name
        AND s.privacy = 'private_friends'
        AND s.created_at > (now() - interval '24 hours')
        AND f.status = 'accepted'
        AND (f.user_id_1 = auth.uid() OR f.user_id_2 = auth.uid())
    )
  )
); 