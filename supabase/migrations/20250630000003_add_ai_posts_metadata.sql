-- Add metadata column to ai_posts table to store full AI response metadata
-- This enables rich source citations and other metadata for AI posts

ALTER TABLE ai_posts ADD COLUMN metadata JSONB;

-- Update create_ai_post function to support metadata
DROP FUNCTION IF EXISTS create_ai_post(TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION create_ai_post(
    commentary TEXT,
    ai_content TEXT,
    source_url TEXT DEFAULT NULL,
    post_privacy TEXT DEFAULT 'public',
    post_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_post_id UUID;
BEGIN
    -- Validate privacy setting
    IF post_privacy NOT IN ('public', 'friends') THEN
        RAISE EXCEPTION 'Invalid privacy setting: must be either "public" or "friends"';
    END IF;

    INSERT INTO ai_posts (user_id, user_commentary, ai_response, source_link, privacy, metadata)
    VALUES (auth.uid(), commentary, ai_content, source_url, post_privacy, post_metadata)
    RETURNING id INTO new_post_id;
    
    RETURN new_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_public_feed function to include metadata
DROP FUNCTION IF EXISTS get_public_feed(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_public_feed(page_limit INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    username TEXT,
    user_commentary TEXT,
    ai_response TEXT,
    source_link TEXT,
    metadata JSONB,
    privacy TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        pr.username,
        p.user_commentary,
        p.ai_response,
        p.source_link,
        p.metadata,
        p.privacy,
        p.created_at
    FROM ai_posts p
    JOIN profiles pr ON p.user_id = pr.id
    WHERE p.privacy = 'public'
    ORDER BY p.created_at DESC
    LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_friend_feed function to include metadata
DROP FUNCTION IF EXISTS get_friend_feed(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_friend_feed(page_limit INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    username TEXT,
    user_commentary TEXT,
    ai_response TEXT,
    source_link TEXT,
    metadata JSONB,
    privacy TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        pr.username,
        p.user_commentary,
        p.ai_response,
        p.source_link,
        p.metadata,
        p.privacy,
        p.created_at
    FROM ai_posts p
    JOIN profiles pr ON p.user_id = pr.id
    WHERE p.privacy = 'friends' AND (
        p.user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM friendships 
            WHERE (
                (friendships.user_id_1 = auth.uid() AND friendships.user_id_2 = p.user_id) OR
                (friendships.user_id_2 = auth.uid() AND friendships.user_id_1 = p.user_id)
            ) AND friendships.status = 'accepted'
        )
    )
    ORDER BY p.created_at DESC
    LIMIT page_limit OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 