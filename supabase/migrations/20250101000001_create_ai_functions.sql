-- Function to get user's AI conversations
CREATE OR REPLACE FUNCTION get_user_ai_conversations()
RETURNS TABLE (
    id UUID,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    message_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.created_at,
        COALESCE(MAX(m.created_at), c.created_at) as last_message_at,
        COUNT(m.id) as message_count
    FROM ai_conversations c
    LEFT JOIN ai_messages m ON c.id = m.conversation_id
    WHERE c.user_id = auth.uid()
    GROUP BY c.id, c.title, c.created_at
    ORDER BY COALESCE(MAX(m.created_at), c.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get messages for a specific AI conversation
CREATE OR REPLACE FUNCTION get_ai_conversation_messages(conversation_uuid UUID)
RETURNS TABLE (
    id UUID,
    sender TEXT,
    content TEXT,
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
        m.created_at
    FROM ai_messages m
    WHERE m.conversation_id = conversation_uuid
    ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update AI conversation title
CREATE OR REPLACE FUNCTION update_ai_conversation_title(
    conversation_uuid UUID,
    new_title TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user owns this conversation
    IF NOT EXISTS (
        SELECT 1 FROM ai_conversations 
        WHERE ai_conversations.id = conversation_uuid 
        AND ai_conversations.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: You do not own this conversation';
    END IF;

    UPDATE ai_conversations 
    SET title = new_title 
    WHERE id = conversation_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new AI conversation
CREATE OR REPLACE FUNCTION create_ai_conversation(conversation_title TEXT DEFAULT 'untitled conversation')
RETURNS UUID AS $$
DECLARE
    new_conversation_id UUID;
BEGIN
    INSERT INTO ai_conversations (user_id, title)
    VALUES (auth.uid(), conversation_title)
    RETURNING id INTO new_conversation_id;
    
    RETURN new_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a message to an AI conversation
CREATE OR REPLACE FUNCTION add_ai_message(
    conversation_uuid UUID,
    message_sender TEXT,
    message_content TEXT
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

    INSERT INTO ai_messages (conversation_id, sender, content)
    VALUES (conversation_uuid, message_sender, message_content)
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get public AI posts feed
CREATE OR REPLACE FUNCTION get_public_feed(page_limit INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
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
    WHERE p.privacy = 'public'
    ORDER BY p.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get friends AI posts feed
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

-- Function to create an AI post
CREATE OR REPLACE FUNCTION create_ai_post(
    commentary TEXT,
    ai_content TEXT,
    source_url TEXT DEFAULT NULL,
    post_privacy TEXT DEFAULT 'public'
)
RETURNS UUID AS $$
DECLARE
    new_post_id UUID;
BEGIN
    -- Validate privacy setting
    IF post_privacy NOT IN ('public', 'friends') THEN
        RAISE EXCEPTION 'Invalid privacy setting: must be either "public" or "friends"';
    END IF;

    INSERT INTO ai_posts (user_id, user_commentary, ai_response, source_link, privacy)
    VALUES (auth.uid(), commentary, ai_content, source_url, post_privacy)
    RETURNING id INTO new_post_id;
    
    RETURN new_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 