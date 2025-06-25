-- Migration: Fix RLS issue in message insertion
-- Description: Updates the send_media_to_friends function to run with SECURITY DEFINER,
-- allowing it to bypass RLS policies when inserting a new message.

DROP FUNCTION IF EXISTS public.send_media_to_friends(text, text, uuid[]);

CREATE OR REPLACE FUNCTION public.send_media_to_friends(p_storage_path text, p_content_type text, p_recipient_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_chat_id BIGINT;
    recipient_id uuid;
BEGIN
    FOREACH recipient_id IN ARRAY p_recipient_ids
    LOOP
        v_chat_id := public.get_or_create_direct_chat(auth.uid(), recipient_id);
        INSERT INTO public.messages (chat_id, sender_id, content_type, storage_path)
        VALUES (v_chat_id, auth.uid(), p_content_type, p_storage_path);
    END LOOP;
END;
$$; 