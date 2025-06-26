-- Migration: Fix Chat Participant RLS
-- Description: Replaces the recursive RLS policy on chat_participants with a
-- non-recursive one. This fixes the infinite recursion error triggered by the
-- storage RLS policy.
-- Author: SnapConnect Team
-- Date: 2024-12-25

-- Drop the previous recursive policy if it exists
DROP POLICY IF EXISTS "Users can view participants of their own chats" ON public.chat_participants;
DROP POLICY IF EXISTS "Users can view their own chat participation" ON public.chat_participants;


-- This new policy allows a user to see their own entry in the chat_participants table.
-- This is safe, non-recursive, and sufficient for other RLS policies (like storage access)
-- that need to check if a user is part of a specific chat.
CREATE POLICY "Users can view their own chat participation records"
ON public.chat_participants
FOR SELECT
USING (
  user_id = auth.uid()
); 