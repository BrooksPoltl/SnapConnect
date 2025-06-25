-- Migration: Fix chat_id data types in functions
-- Description: Updates chat-related functions to use BIGINT for chat_id, aligning them
-- with the table schema and resolving the UUID type casting error.

DROP FUNCTION IF EXISTS public.get_or_create_direct_chat(uuid, uuid);
DROP FUNCTION IF EXISTS public.send_media_to_friends(text, text, uuid[]);

CREATE OR REPLACE FUNCTION public.get_or_create_direct_chat(p_user_id1 uuid, p_user_id2 uuid)
RETURNS BIGINT -- Changed from uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_chat_id BIGINT; -- Changed from uuid
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

CREATE OR REPLACE FUNCTION send_media_to_friends(p_storage_path text, p_content_type text, p_recipient_ids uuid[])
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_chat_id BIGINT; -- Changed from uuid
    recipient_id uuid;
BEGIN
    FOREACH recipient_id IN ARRAY p_recipient_ids
    LOOP
        v_chat_id := get_or_create_direct_chat(auth.uid(), recipient_id);
        INSERT INTO messages (chat_id, sender_id, content_type, storage_path)
        VALUES (v_chat_id, auth.uid(), p_content_type, p_storage_path);
    END LOOP;
END;
$$; 