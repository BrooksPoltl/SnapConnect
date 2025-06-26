-- Migration: Stories Usability Fixes
-- Description: Fixes storage RLS, adds story view tracking, and updates story feed function.
-- Author: SnapConnect Team
-- Date: 2025-06-26

-- ============================================================================
-- 1. FIX STORAGE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Drop old policies to ensure a clean slate.
DROP POLICY IF EXISTS "Allow authenticated view of media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated views" ON storage.objects;

-- Create a single, comprehensive policy for viewing media in stories and messages.
CREATE POLICY "Allow authenticated read access to media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'media' AND (
    -- 1. User is the owner of the object.
    owner = auth.uid()
    OR
    -- 2. User has access via a chat message.
    EXISTS (
      SELECT 1
      FROM public.messages m
      JOIN public.chat_participants cp ON m.chat_id = cp.chat_id
      WHERE cp.user_id = auth.uid()
      AND m.storage_path = storage.objects.name
    )
    OR
    -- 3. User has access via a story. This relies on the RLS policy of the stories table.
    EXISTS (
      SELECT 1
      FROM public.stories s
      WHERE s.storage_path = storage.objects.name
    )
  )
);

-- ============================================================================
-- 2. CREATE STORY_VIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.story_views (
    story_id BIGINT NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (story_id, user_id)
);

-- Add indexes for performance.
CREATE INDEX IF NOT EXISTS story_views_user_id_idx ON public.story_views(user_id);

-- Enable RLS for the new table.
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

-- Define RLS policies for story_views.
CREATE POLICY "Users can view their own story views" ON public.story_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own story views" ON public.story_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. CREATE mark_story_viewed DATABASE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.mark_story_viewed(p_story_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER -- Use invoker to respect RLS on the stories table.
AS $$
BEGIN
    -- Check if the story exists and is visible to the user (RLS is applied on SELECT).
    -- If the SELECT returns no row, the user can't see the story, and we do nothing.
    IF EXISTS (SELECT 1 FROM public.stories WHERE id = p_story_id) THEN
        INSERT INTO public.story_views (story_id, user_id)
        VALUES (p_story_id, auth.uid())
        ON CONFLICT (story_id, user_id) DO NOTHING;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_story_viewed(BIGINT) TO authenticated;

-- ============================================================================
-- 4. UPDATE get_stories_feed DATABASE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_stories_feed()
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'author_id', p.id,
                'username', p.username,
                'stories', (
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'storage_path', s.storage_path,
                            'media_type', s.media_type,
                            'created_at', s.created_at,
                            -- Check if a view record exists for the current user and this story.
                            'is_viewed', EXISTS (
                                SELECT 1
                                FROM public.story_views sv
                                WHERE sv.story_id = s.id AND sv.user_id = auth.uid()
                            )
                        ) ORDER BY s.created_at ASC
                    )
                    FROM public.stories s
                    WHERE s.author_id = p.id
                ),
                -- Check if all of the author's visible stories have been viewed by the current user.
                'all_stories_viewed', (
                    SELECT NOT EXISTS (
                        SELECT 1
                        FROM public.stories s
                        WHERE s.author_id = p.id
                        AND NOT EXISTS (
                            SELECT 1
                            FROM public.story_views sv
                            WHERE sv.story_id = s.id AND sv.user_id = auth.uid()
                        )
                    )
                )
            )
        )
        FROM public.profiles p
        WHERE p.id IN (SELECT DISTINCT author_id FROM public.stories)
    );
END;
$$;

-- Grant permissions again in case the function was replaced
GRANT EXECUTE ON FUNCTION public.get_stories_feed() TO authenticated;
