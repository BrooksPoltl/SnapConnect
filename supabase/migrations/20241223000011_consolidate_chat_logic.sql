-- Migration: Consolidate Chat Logic
-- Description: Creates a helper function to get or create direct chats, and updates
-- the send_media_to_friends function to use it, preventing duplicate conversations.
-- Author: SnapConnect Team
-- Date: 2024-12-24

-- ============================================================================
-- HELPER FUNCTION: GET OR CREATE DIRECT CHAT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_or_create_direct_chat(
    p_recipient_id UUID
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_id BIGINT;
    v_current_user_id UUID := auth.uid();
BEGIN
    -- Look for an existing direct chat between the two users
    SELECT cp1.chat_id INTO v_chat_id
    FROM public.chat_participants cp1
    JOIN public.chat_participants cp2 ON cp1.chat_id = cp2.chat_id
    WHERE cp1.user_id = v_current_user_id AND cp2.user_id = p_recipient_id
    AND (
        SELECT COUNT(*)
        FROM public.chat_participants
        WHERE chat_id = cp1.chat_id
    ) = 2; -- Ensure it's a direct chat, not a group

    -- If no chat exists, create a new one
    IF v_chat_id IS NULL THEN
        INSERT INTO public.chats (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING id INTO v_chat_id;

        INSERT INTO public.chat_participants (chat_id, user_id)
        VALUES (v_chat_id, v_current_user_id), (v_chat_id, p_recipient_id);
    END IF;

    RETURN v_chat_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_or_create_direct_chat(UUID) TO authenticated;


-- ============================================================================
-- MAIN FUNCTION: SEND MEDIA TO FRIENDS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.send_media_to_friends(
    p_storage_path TEXT,
    p_content_type TEXT, -- 'image' or 'video'
    p_recipient_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    recipient_id UUID;
    v_chat_id BIGINT;
BEGIN
    FOREACH recipient_id IN ARRAY p_recipient_ids
    LOOP
        -- Get or create a chat with this friend
        v_chat_id := public.get_or_create_direct_chat(recipient_id);

        -- Insert the media message into the chat
        INSERT INTO public.messages(chat_id, sender_id, content_type, storage_path)
        VALUES (v_chat_id, auth.uid(), p_content_type, p_storage_path);
    END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_media_to_friends(TEXT, TEXT, UUID[]) TO authenticated;
