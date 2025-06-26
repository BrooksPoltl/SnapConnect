-- Migration: Correctly handle story deletion by separating DB and Storage operations.
-- Description: This migration updates the public.delete_story function to only
--              delete the database record and return the storage path. The client
--              will be responsible for deleting the object from storage. This
--              aligns with Supabase best practices.
-- Author: Gemini
-- Date: 2025-06-30

DROP FUNCTION IF EXISTS public.delete_story(p_story_id BIGINT);

CREATE OR REPLACE FUNCTION public.delete_story(p_story_id BIGINT)
RETURNS TEXT -- Return the storage path for the client to handle
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_story_author_id UUID;
    v_storage_path TEXT;
BEGIN
    -- Get the author_id and storage_path for the story.
    SELECT author_id, storage_path INTO v_story_author_id, v_storage_path
    FROM public.stories
    WHERE id = p_story_id;

    -- If no story was found, raise an exception.
    IF v_story_author_id IS NULL THEN
        RAISE EXCEPTION 'Story not found: %', p_story_id;
    END IF;

    -- Security Check: Ensure the user calling the function is the author.
    IF auth.uid() != v_story_author_id THEN
        RAISE EXCEPTION 'User is not authorized to delete this story';
    END IF;

    -- Delete the story from the table.
    DELETE FROM public.stories
    WHERE id = p_story_id;

    -- Return the storage path so the client can delete the object.
    RETURN v_storage_path;
END;
$$; 