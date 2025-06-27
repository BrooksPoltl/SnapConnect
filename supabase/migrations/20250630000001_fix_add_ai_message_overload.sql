-- Fix add_ai_message function overloading issue
-- Drop all versions of the function first to avoid conflicts

DROP FUNCTION IF EXISTS add_ai_message(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS add_ai_message(UUID, TEXT, TEXT, JSONB);

-- Recreate the function with metadata support
CREATE OR REPLACE FUNCTION add_ai_message(
    conversation_uuid UUID,
    message_sender TEXT,
    message_content TEXT,
    message_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_message_id UUID;
BEGIN
    -- Check if user owns this conversation
    IF NOT EXISTS (
        SELECT 1 FROM ai_conversations 
        WHERE ai_conversations.id = conversation_uuid 
        AND ai_conversations.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: You do not own this conversation';
    END IF;

    -- Validate sender
    IF message_sender NOT IN ('user', 'ai') THEN
        RAISE EXCEPTION 'Invalid sender: must be either "user" or "ai"';
    END IF;

    INSERT INTO ai_messages (conversation_id, sender, content, metadata)
    VALUES (conversation_uuid, message_sender, message_content, message_metadata)
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 