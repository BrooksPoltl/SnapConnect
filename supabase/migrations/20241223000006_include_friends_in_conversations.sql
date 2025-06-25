-- Migration: Include Friends in Conversations List
-- Description: Updates get_user_conversations to show friends without chat history
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- UPDATE GET_USER_CONVERSATIONS TO INCLUDE FRIENDS WITHOUT CHATS
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
    WITH user_friends AS (
        -- Get all accepted friends of the current user
        SELECT 
            CASE 
                WHEN f.user_id_1 = auth.uid() THEN f.user_id_2
                ELSE f.user_id_1
            END as friend_id,
            p.username as friend_username,
            f.updated_at as friendship_date
        FROM public.friendships f
        JOIN public.profiles p ON p.id = CASE 
            WHEN f.user_id_1 = auth.uid() THEN f.user_id_2
            ELSE f.user_id_1
        END
        WHERE f.status = 'accepted'
        AND (f.user_id_1 = auth.uid() OR f.user_id_2 = auth.uid())
    ),
    existing_chats AS (
        -- Get existing chats with friends
        SELECT DISTINCT
            c.id as chat_id,
            uf.friend_id as other_user_id,
            uf.friend_username as other_username,
            c.created_at as chat_created_at
        FROM user_friends uf
        LEFT JOIN public.chat_participants cp1 ON cp1.user_id = auth.uid()
        LEFT JOIN public.chat_participants cp2 ON cp2.user_id = uf.friend_id AND cp2.chat_id = cp1.chat_id
        LEFT JOIN public.chats c ON c.id = cp1.chat_id
        WHERE cp2.user_id IS NOT NULL -- Only include if both users are in the same chat
    ),
    last_messages AS (
        -- Get the most recent message for each existing chat
        SELECT DISTINCT ON (m.chat_id)
            m.chat_id,
            m.id as message_id,
            m.content_text as content,
            m.content_type,
            m.sender_id,
            m.created_at,
            m.viewed_at
        FROM public.messages m
        WHERE m.chat_id IN (SELECT ec.chat_id FROM existing_chats ec WHERE ec.chat_id IS NOT NULL)
        ORDER BY m.chat_id, m.created_at DESC
    )
    -- Return existing chats with messages
    SELECT 
        ec.chat_id,
        ec.other_user_id,
        ec.other_username,
        COALESCE(lm.message_id, 0) as last_message_id,
        lm.content as last_message_content,
        COALESCE(lm.content_type, '') as last_message_type,
        lm.sender_id as last_message_sender_id,
        lm.created_at as last_message_created_at,
        lm.viewed_at as last_message_viewed_at,
        COALESCE(lm.created_at, ec.chat_created_at) as last_activity
    FROM existing_chats ec
    LEFT JOIN last_messages lm ON lm.chat_id = ec.chat_id
    WHERE ec.chat_id IS NOT NULL
    
    UNION ALL
    
    -- Return friends without chats (chat_id = 0 means no chat exists)
    SELECT 
        0 as chat_id,
        uf.friend_id as other_user_id,
        uf.friend_username as other_username,
        0 as last_message_id,
        NULL as last_message_content,
        '' as last_message_type,
        NULL as last_message_sender_id,
        NULL as last_message_created_at,
        NULL as last_message_viewed_at,
        uf.friendship_date as last_activity
    FROM user_friends uf
    WHERE uf.friend_id NOT IN (
        SELECT ec.other_user_id FROM existing_chats ec WHERE ec.chat_id IS NOT NULL
    )
    
    ORDER BY last_activity DESC NULLS LAST;
END;
$$; 