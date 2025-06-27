-- Fix infinite recursion in group_members RLS policy
-- The issue is that the policy checks group membership by querying the same table,
-- causing infinite recursion. We need to use a security definer function approach.

-- First, create a helper function to check group membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_user_group_member(p_group_id BIGINT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- This function runs with elevated privileges and bypasses RLS
    RETURN EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = p_group_id AND user_id = p_user_id
    );
END;
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;

-- Create a new policy that uses the helper function to avoid recursion
CREATE POLICY "Users can view group members" ON public.group_members
    FOR SELECT USING (
        -- Use the security definer function to check membership without recursion
        public.is_user_group_member(group_id, auth.uid())
    );

-- Also update the messages RLS policies to use the helper function
-- This prevents potential recursion when checking group membership for messages

-- Drop existing message policies
DROP POLICY IF EXISTS "Users can view messages in their chats and groups with TTL" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their chats and groups" ON public.messages;

-- Recreate message viewing policy with helper function
CREATE POLICY "Users can view messages in their chats and groups with TTL" ON public.messages
    FOR SELECT USING (
        (
            -- Direct messages: user must be a participant in the chat
            chat_id IS NOT NULL AND chat_id IN (
                SELECT chat_id FROM public.chat_participants 
                WHERE user_id = auth.uid()
            )
        ) OR (
            -- Group messages: use helper function to check membership
            group_id IS NOT NULL AND public.is_user_group_member(group_id, auth.uid())
        )
        -- AND message must not be expired (24 hours after being viewed, or unread)
        AND (
            viewed_at IS NULL  -- Unread messages never expire
            OR viewed_at > (NOW() - INTERVAL '24 hours')  -- Read messages expire after 24 hours
        )
    );

-- Recreate message insertion policy with helper function
CREATE POLICY "Users can send messages to their chats and groups" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND (
            -- Direct messages: user must be a participant in the chat
            (chat_id IS NOT NULL AND chat_id IN (
                SELECT chat_id FROM public.chat_participants 
                WHERE user_id = auth.uid()
            )) OR
            -- Group messages: use helper function to check membership
            (group_id IS NOT NULL AND public.is_user_group_member(group_id, auth.uid()))
        )
    ); 