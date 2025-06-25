-- Migration: Chat Functionality Update
-- Description: Adds viewed_at column and implements chat functions for real-time messaging
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- UPDATE MESSAGES TABLE SCHEMA
-- ============================================================================

-- Add viewed_at column to messages table for tracking when messages are read
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ NULL;

-- Create index for efficient TTL queries on viewed_at
CREATE INDEX IF NOT EXISTS messages_viewed_at_idx ON public.messages(viewed_at) WHERE viewed_at IS NOT NULL;

-- ============================================================================
-- UPDATE RLS POLICIES FOR VIEW-BASED EXPIRATION
-- ============================================================================

-- Drop existing message viewing policy
DROP POLICY IF EXISTS "Users can view recent messages in their chats" ON public.messages;

-- Create new policy that implements view-based expiration for private messages
CREATE POLICY "Users can view messages in their chats with TTL" ON public.messages
    FOR SELECT USING (
        -- User must be a participant in the chat
        chat_id IN (
            SELECT chat_id FROM public.chat_participants 
            WHERE user_id = auth.uid()
        )
        -- AND message must not be expired (24 hours after being viewed, or unread)
        AND (
            viewed_at IS NULL  -- Unread messages never expire
            OR viewed_at > (NOW() - INTERVAL '24 hours')  -- Read messages expire after 24 hours
        )
    );

-- ============================================================================
-- DATABASE FUNCTIONS FOR CHAT FUNCTIONALITY
-- ============================================================================

-- Function to get user conversations with last message info
CREATE OR REPLACE FUNCTION public.get_user_conversations()
RETURNS TABLE (
    chat_id BIGINT,
    other_user_id UUID,
    other_username TEXT,
    last_message_id BIGINT,
    last_message_content TEXT,
    last_message_type TEXT,
    last_message_sender_id UUID,
    last_message_created_at TIMESTAMPTZ,
    last_message_viewed_at TIMESTAMPTZ,
    last_activity TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH user_chats AS (
        -- Get all chats the current user participates in
        SELECT DISTINCT cp.chat_id
        FROM public.chat_participants cp
        WHERE cp.user_id = auth.uid()
    ),
    chat_with_other_user AS (
        -- For each chat, find the other participant
        SELECT 
            uc.chat_id,
            cp.user_id as other_user_id,
            p.username as other_username
        FROM user_chats uc
        JOIN public.chat_participants cp ON cp.chat_id = uc.chat_id
        JOIN public.profiles p ON p.id = cp.user_id
        WHERE cp.user_id != auth.uid()
    ),
    last_messages AS (
        -- Get the most recent message for each chat
        SELECT DISTINCT ON (m.chat_id)
            m.chat_id,
            m.id as message_id,
            m.content_text as content,
            m.content_type,
            m.sender_id,
            m.created_at,
            m.viewed_at
        FROM public.messages m
        WHERE m.chat_id IN (SELECT chat_id FROM user_chats)
        ORDER BY m.chat_id, m.created_at DESC
    )
    SELECT 
        cwou.chat_id,
        cwou.other_user_id,
        cwou.other_username,
        COALESCE(lm.message_id, 0) as last_message_id,
        lm.content as last_message_content,
        COALESCE(lm.content_type, '') as last_message_type,
        lm.sender_id as last_message_sender_id,
        lm.created_at as last_message_created_at,
        lm.viewed_at as last_message_viewed_at,
        COALESCE(lm.created_at, c.created_at) as last_activity
    FROM chat_with_other_user cwou
    JOIN public.chats c ON c.id = cwou.chat_id
    LEFT JOIN last_messages lm ON lm.chat_id = cwou.chat_id
    ORDER BY last_activity DESC NULLS LAST;
END;
$$;

-- Function to mark messages as viewed
CREATE OR REPLACE FUNCTION public.mark_messages_as_viewed(p_chat_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_count INTEGER;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a participant in this chat
    IF NOT EXISTS (
        SELECT 1 FROM public.chat_participants 
        WHERE chat_id = p_chat_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to access this chat';
    END IF;
    
    -- Update viewed_at for messages sent by other users that haven't been viewed yet
    UPDATE public.messages 
    SET viewed_at = NOW()
    WHERE chat_id = p_chat_id 
        AND sender_id != current_user_id 
        AND viewed_at IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- If we updated any messages, broadcast a notification
    IF updated_count > 0 THEN
        PERFORM pg_notify(
            'message_read',
            json_build_object(
                'chat_id', p_chat_id,
                'viewed_by', current_user_id,
                'viewed_at', NOW(),
                'message_count', updated_count
            )::text
        );
    END IF;
END;
$$;

-- Function to send a text message
CREATE OR REPLACE FUNCTION public.send_message(
    p_chat_id BIGINT,
    p_content_text TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    message_id BIGINT;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a participant in this chat
    IF NOT EXISTS (
        SELECT 1 FROM public.chat_participants 
        WHERE chat_id = p_chat_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to send messages to this chat';
    END IF;
    
    -- Validate message content
    IF p_content_text IS NULL OR length(trim(p_content_text)) = 0 THEN
        RAISE EXCEPTION 'Message content cannot be empty';
    END IF;
    
    -- Insert the message
    INSERT INTO public.messages (chat_id, sender_id, content_type, content_text)
    VALUES (p_chat_id, current_user_id, 'text', trim(p_content_text))
    RETURNING id INTO message_id;
    
    -- Update chat's updated_at timestamp
    UPDATE public.chats 
    SET updated_at = NOW() 
    WHERE id = p_chat_id;
    
    RETURN message_id;
END;
$$;

-- Function to get messages for a specific chat
CREATE OR REPLACE FUNCTION public.get_chat_messages(p_chat_id BIGINT, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    id BIGINT,
    sender_id UUID,
    sender_username TEXT,
    content_type TEXT,
    content_text TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    is_own_message BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a participant in this chat
    IF NOT EXISTS (
        SELECT 1 FROM public.chat_participants 
        WHERE chat_id = p_chat_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to access this chat';
    END IF;
    
    RETURN QUERY
    SELECT 
        m.id,
        m.sender_id,
        p.username as sender_username,
        m.content_type,
        m.content_text,
        m.storage_path,
        m.created_at,
        m.viewed_at,
        (m.sender_id = current_user_id) as is_own_message
    FROM public.messages m
    JOIN public.profiles p ON p.id = m.sender_id
    WHERE m.chat_id = p_chat_id
        -- Apply TTL policy: unread messages or read within 24 hours
        AND (
            m.viewed_at IS NULL 
            OR m.viewed_at > (NOW() - INTERVAL '24 hours')
        )
    ORDER BY m.created_at DESC
    LIMIT p_limit;
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on the new functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_conversations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_as_viewed(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_message(BIGINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_chat_messages(BIGINT, INTEGER) TO authenticated; 