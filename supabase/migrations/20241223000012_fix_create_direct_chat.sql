-- Migration: Fix Create Direct Chat
-- Description: Updates the create_direct_chat function to correctly find existing
-- chats regardless of initiator, preventing duplicate conversations.
-- Author: SnapConnect Team
-- Date: 2024-12-24

-- ============================================================================
-- DROP EXISTING FUNCTION
-- ============================================================================
DROP FUNCTION IF EXISTS public.create_direct_chat(UUID);


-- ============================================================================
-- FIX CREATE_DIRECT_CHAT FUNCTION
-- ============================================================================

CREATE FUNCTION public.create_direct_chat(
    p_recipient_id UUID
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_chat_id BIGINT;
    v_current_user_id UUID := auth.uid();
BEGIN
    -- Find an existing direct chat that contains exactly the two users.
    -- This is more robust than checking cp1.user_id = A and cp2.user_id = B.
    SELECT c.id INTO v_chat_id
    FROM public.chats c
    WHERE EXISTS (
        SELECT 1 FROM public.chat_participants WHERE chat_id = c.id AND user_id = v_current_user_id
    ) AND EXISTS (
        SELECT 1 FROM public.chat_participants WHERE chat_id = c.id AND user_id = p_recipient_id
    ) AND (
        SELECT COUNT(*) FROM public.chat_participants WHERE chat_id = c.id
    ) = 2
    LIMIT 1;

    -- If a chat already exists, return its ID
    IF v_chat_id IS NOT NULL THEN
        RETURN v_chat_id;
    END IF;

    -- If no chat exists, create a new one
    INSERT INTO public.chats (created_at, updated_at)
    VALUES (NOW(), NOW())
    RETURNING id INTO v_chat_id;

    INSERT INTO public.chat_participants (chat_id, user_id)
    VALUES (v_chat_id, v_current_user_id), (v_chat_id, p_recipient_id);

    RETURN v_chat_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_direct_chat(UUID) TO authenticated;
