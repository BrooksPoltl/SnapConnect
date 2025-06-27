-- Migration: Fix get_friend_feed function
-- Description: Updates get_friend_feed to use correct table name and column names
-- Author: SnapConnect Team
-- Date: 2025-01-01

-- Function to get friends AI posts feed (FIXED)
CREATE OR REPLACE FUNCTION get_friend_feed(page_limit INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    username TEXT,
    user_commentary TEXT,
    ai_response TEXT,
    source_link TEXT,
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
        p.created_at
    FROM ai_posts p
    JOIN profiles pr ON p.user_id = pr.id
    WHERE p.privacy = 'friends' 
    AND (
        p.user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM friendships f
            WHERE (
                (f.user_id_1 = auth.uid() AND f.user_id_2 = p.user_id) OR
                (f.user_id_2 = auth.uid() AND f.user_id_1 = p.user_id)
            ) AND f.status = 'accepted'
        )
    )
    ORDER BY p.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_friend_feed(INTEGER, INTEGER) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_friend_feed(INTEGER, INTEGER) IS 'Get AI posts from friends with proper friendship table reference'; 