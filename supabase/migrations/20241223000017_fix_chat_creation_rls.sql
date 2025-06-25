-- Migration: Fix RLS issue in chat creation
-- Description: Updates the get_or_create_direct_chat function to run with SECURITY DEFINER
-- This allows it to bypass RLS when creating a new chat and adding both participants.

CREATE OR REPLACE FUNCTION public.get_or_create_direct_chat(p_user_id1 uuid, p_user_id2 uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_chat_id uuid;
BEGIN
    -- Find an existing direct chat between the two users
    SELECT cp1.chat_id INTO v_chat_id
    FROM public.chat_participants cp1
    JOIN public.chat_participants cp2 ON cp1.chat_id = cp2.chat_id
    WHERE cp1.user_id = p_user_id1 AND cp2.user_id = p_user_id2;

    -- If no chat exists, create a new one
    IF v_chat_id IS NULL THEN
        INSERT INTO public.chats (chat_type) VALUES ('direct') RETURNING id INTO v_chat_id;
        INSERT INTO public.chat_participants (chat_id, user_id) VALUES (v_chat_id, p_user_id1), (v_chat_id, p_user_id2);
    END IF;

    RETURN v_chat_id;
END;
$$; 