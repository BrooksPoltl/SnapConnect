-- Add metadata column to ai_messages table to store sources and other metadata
ALTER TABLE ai_messages ADD COLUMN metadata JSONB;

-- Update the add_ai_message function to support metadata
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

-- Drop the existing function first to allow changing return type
DROP FUNCTION IF EXISTS get_ai_conversation_messages(UUID);

-- Create the updated function to return metadata
CREATE OR REPLACE FUNCTION get_ai_conversation_messages(conversation_uuid UUID)
RETURNS TABLE (
    id UUID,
    sender TEXT,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if user owns this conversation
    IF NOT EXISTS (
        SELECT 1 FROM ai_conversations 
        WHERE ai_conversations.id = conversation_uuid 
        AND ai_conversations.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: You do not own this conversation';
    END IF;

    RETURN QUERY
    SELECT 
        m.id,
        m.sender,
        m.content,
        m.metadata,
        m.created_at
    FROM ai_messages m
    WHERE m.conversation_id = conversation_uuid
    ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 