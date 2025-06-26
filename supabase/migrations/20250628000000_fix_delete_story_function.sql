-- Migration: Fix delete_story function to correctly remove storage objects.
-- Description: This migration updates the public.delete_story function
--              to use `storage.remove` as `storage.delete_objects` is deprecated
--              and was causing errors.
-- Author: Gemini
-- Date: 2025-06-28

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
        PERFORM storage.remove(ARRAY[v_storage_path]);
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_story(BIGINT) TO authenticated; 