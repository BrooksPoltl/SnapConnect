-- Migration: Enable Realtime for Chat Tables
-- Description: Enables Realtime subscriptions for messages table
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- ENABLE REALTIME FOR MESSAGES TABLE
-- ============================================================================

-- Enable Realtime for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Optionally enable for other tables if needed in the future
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;

-- ============================================================================
-- GRANT REALTIME PERMISSIONS
-- ============================================================================

-- Ensure authenticated users can subscribe to realtime events
GRANT SELECT ON public.messages TO authenticated;
GRANT SELECT ON public.chats TO authenticated;
GRANT SELECT ON public.chat_participants TO authenticated; 