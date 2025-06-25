-- Migration: Fix Ambiguous chat_id Reference
-- Description: Fixes the ambiguous column reference in get_user_conversations function
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- FIX AMBIGUOUS CHAT_ID REFERENCE IN GET_USER_CONVERSATIONS FUNCTION
-- ============================================================================

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
        WHERE m.chat_id IN (SELECT uc.chat_id FROM user_chats uc)  -- Fixed: explicitly reference uc.chat_id
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