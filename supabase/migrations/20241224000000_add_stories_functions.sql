-- supabase/migrations/20241224000000_add_stories_functions.sql

CREATE OR REPLACE FUNCTION public.post_story(
    p_storage_path TEXT,
    p_media_type TEXT, -- 'image' or 'video'
    p_privacy TEXT -- 'public' or 'private_friends'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Input validation to ensure required parameters are provided.
    IF p_storage_path IS NULL OR trim(p_storage_path) = '' THEN
        RAISE EXCEPTION 'storage_path cannot be empty';
    END IF;

    IF p_media_type NOT IN ('image', 'video') THEN
        RAISE EXCEPTION 'Invalid media_type. Must be ''image'' or ''video''.';
    END IF;

    IF p_privacy NOT IN ('public', 'private_friends') THEN
        RAISE EXCEPTION 'Invalid privacy level. Must be ''public'' or ''private_friends''.';
    END IF;

    -- Insert the new story record into the public.stories table.
    -- The author_id is securely obtained from the session's authenticated user.
    INSERT INTO public.stories (author_id, storage_path, media_type, privacy)
    VALUES (auth.uid(), p_storage_path, p_media_type, p_privacy);
END;
$$;

-- Grant execution permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.post_story(TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_stories_feed()
RETURNS JSON
LANGUAGE plpgsql
-- By omitting 'SECURITY DEFINER', the function defaults to 'SECURITY INVOKER'.
-- This is crucial for security as it ensures that the RLS policies on the
-- 'stories' table are enforced for the user who is calling the function.
AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'author_id', p.id,
                'username', p.username,
                'stories', (
                    -- This subquery is subject to RLS. The user will only see
                    -- stories they have permission to view (public, or private from friends).
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'storage_path', s.storage_path,
                            'media_type', s.media_type,
                            'created_at', s.created_at
                        ) ORDER BY s.created_at ASC
                    )
                    FROM public.stories s
                    WHERE s.author_id = p.id
                )
            )
        )
        -- The outer query gets all profiles that have at least one story *visible to the current user*.
        -- If a user only has private stories and the current user is not a friend, they won't appear in the feed.
        FROM public.profiles p
        WHERE p.id IN (SELECT DISTINCT author_id FROM public.stories)
    );
END;
$$;

-- Grant execution permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_stories_feed() TO authenticated; 