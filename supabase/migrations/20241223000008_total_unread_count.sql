-- Migration: Total Unread Message Count Function
-- Description: Adds a function to get total unread message count for current user
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- CREATE FUNCTION TO GET TOTAL UNREAD MESSAGE COUNT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_total_unread_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_unread INTEGER;
BEGIN
    -- Count all unread messages sent to the current user
    SELECT COUNT(*)::INTEGER INTO total_unread
    FROM public.messages m
    JOIN public.chat_participants cp ON cp.chat_id = m.chat_id
    WHERE cp.user_id = auth.uid()           -- User is participant in the chat
    AND m.sender_id != auth.uid()           -- Message was sent by someone else
    AND m.viewed_at IS NULL;                -- Message hasn't been viewed yet
    
    RETURN COALESCE(total_unread, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_total_unread_count() TO authenticated; 