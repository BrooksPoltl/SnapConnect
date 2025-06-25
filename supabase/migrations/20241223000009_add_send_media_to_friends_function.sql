-- Migration: Add Media Messaging Functionality
-- Description: Creates storage policies and a function to send media to multiple friends.
-- Author: SnapConnect Team
-- Date: 2024-12-24

-- ============================================================================
-- 1. SETUP STORAGE BUCKET RLS
-- ============================================================================
-- This policy allows any authenticated user to upload to the 'media' bucket.
CREATE POLICY "Allow authenticated uploads to media bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- This policy allows users to view media if they are part of the chat
-- where the media was sent. This is a more complex query that joins
-- messages and chat_participants to check for access rights.
CREATE POLICY "Allow authenticated view of media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'media' AND
  EXISTS (
    SELECT 1
    FROM public.messages m
    JOIN public.chat_participants cp ON m.chat_id = cp.chat_id
    WHERE cp.user_id = auth.uid()
    AND m.storage_path = storage.objects.name
  )
);


-- ============================================================================
-- 2. CREATE MULTI-SEND DATABASE FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.send_media_to_friends(
    p_storage_path TEXT,
    p_content_type TEXT,
    p_recipient_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recipient_id UUID;
    chat_id_val BIGINT;
BEGIN
    -- Loop through the array of recipient UUIDs
    FOREACH recipient_id IN ARRAY p_recipient_ids
    LOOP
        -- Get or create the direct chat with the recipient
        chat_id_val := public.create_direct_chat(recipient_id);
        
        -- Insert a new message record into the messages table for this chat
        INSERT INTO public.messages (chat_id, sender_id, content_type, storage_path)
        VALUES (chat_id_val, auth.uid(), p_content_type, p_storage_path);
        
        -- Update the chat's updated_at timestamp to bring it to the top of the list
        UPDATE public.chats 
        SET updated_at = NOW() 
        WHERE id = chat_id_val;
    END LOOP;
END;
$$; 