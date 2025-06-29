-- Migration: Fix Get User Conversations Duplicates
-- Description: Fixes duplicate entries in get_user_conversations by filtering for direct chats only
-- Author: SnapConnect Team
-- Date: 2024-06-30

-- ============================================================================
-- FIX GET_USER_CONVERSATIONS TO PREVENT DUPLICATES FROM GROUP CHATS
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
    last_activity TIMESTAMPTZ,
    unread_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
BEGIN
    RETURN QUERY
    WITH conversations_with_details AS (
        -- Step 1: Get all DIRECT chats the user is part of and identify the other user
        SELECT
            c.id AS chat_id,
            p.user_id as other_user_id
        FROM
            public.chats c
        JOIN
            public.chat_participants p ON c.id = p.chat_id
        WHERE
            c.chat_type = 'direct'  -- Only include direct chats to prevent duplicates
            AND p.user_id <> current_user_id
            AND c.id IN (
                SELECT cp.chat_id
                FROM public.chat_participants cp
                WHERE cp.user_id = current_user_id
            )
    ),
    -- Step 2: Get last message and unread count for each conversation
    chat_agg AS (
        SELECT
            c.chat_id,
            c.other_user_id,
            p.username as other_username,
            (
                SELECT m.id
                FROM public.messages m
                WHERE m.chat_id = c.chat_id
                ORDER BY m.created_at DESC
                LIMIT 1
            ) AS last_message_id,
            (
                SELECT COUNT(*)
                FROM public.messages m
                WHERE m.chat_id = c.chat_id
                AND m.sender_id <> current_user_id
                AND m.viewed_at IS NULL
            )::INTEGER AS unread_count
        FROM conversations_with_details c
        JOIN public.profiles p ON p.id = c.other_user_id
    )
    -- Step 3: Combine with message details and friends list
    SELECT
        ca.chat_id,
        ca.other_user_id,
        ca.other_username,
        ca.last_message_id,
        m.content_text AS last_message_content,
        m.content_type AS last_message_type,
        m.sender_id AS last_message_sender_id,
        m.created_at AS last_message_created_at,
        m.viewed_at AS last_message_viewed_at,
        m.created_at AS last_activity,
        ca.unread_count
    FROM chat_agg ca
    LEFT JOIN public.messages m ON m.id = ca.last_message_id

    UNION ALL

    -- Step 4: Include friends who have no chat history
    SELECT
        0::BIGINT AS chat_id,
        f.friend_id AS other_user_id,
        f.friend_username AS other_username,
        0::BIGINT AS last_message_id,
        NULL AS last_message_content,
        '' AS last_message_type,
        NULL AS last_message_sender_id,
        NULL AS last_message_created_at,
        NULL AS last_message_viewed_at,
        f.friendship_date AS last_activity,
        0 AS unread_count
    FROM (
        SELECT
            CASE
                WHEN f.user_id_1 = current_user_id THEN f.user_id_2
                ELSE f.user_id_1
            END as friend_id,
            p.username as friend_username,
            f.updated_at as friendship_date
        FROM public.friendships f
        JOIN public.profiles p ON p.id = CASE
            WHEN f.user_id_1 = current_user_id THEN f.user_id_2
            ELSE f.user_id_1
        END
        WHERE f.status = 'accepted' AND (f.user_id_1 = current_user_id OR f.user_id_2 = current_user_id)
    ) f
    WHERE NOT EXISTS (
        SELECT 1
        FROM conversations_with_details cwd
        WHERE cwd.other_user_id = f.friend_id
    )

    ORDER BY last_activity DESC NULLS LAST;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_conversations() TO authenticated; 