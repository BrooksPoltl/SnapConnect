-- Update get_user_ai_conversations to include last message content and metadata for previews
-- This enables rich conversation previews on the AI home screen

DROP FUNCTION IF EXISTS get_user_ai_conversations();

CREATE OR REPLACE FUNCTION get_user_ai_conversations()
RETURNS TABLE (
    id UUID,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    message_count BIGINT,
    last_message_content TEXT,
    last_message_metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH conversation_stats AS (
        SELECT 
            c.id,
            c.title,
            c.created_at,
            COALESCE(MAX(m.created_at), c.created_at) as last_message_at,
            COUNT(m.id) as message_count,
            -- Get the last AI message content and metadata for preview
            (
                SELECT m2.content 
                FROM ai_messages m2 
                WHERE m2.conversation_id = c.id 
                AND m2.sender = 'ai'
                ORDER BY m2.created_at DESC 
                LIMIT 1
            ) as last_ai_message_content,
            (
                SELECT m2.metadata 
                FROM ai_messages m2 
                WHERE m2.conversation_id = c.id 
                AND m2.sender = 'ai'
                ORDER BY m2.created_at DESC 
                LIMIT 1
            ) as last_ai_message_metadata
        FROM ai_conversations c
        LEFT JOIN ai_messages m ON c.id = m.conversation_id
        WHERE c.user_id = auth.uid()
        GROUP BY c.id, c.title, c.created_at
    )
    SELECT 
        cs.id,
        cs.title,
        cs.created_at,
        cs.last_message_at,
        cs.message_count,
        cs.last_ai_message_content as last_message_content,
        cs.last_ai_message_metadata as last_message_metadata
    FROM conversation_stats cs
    ORDER BY cs.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 