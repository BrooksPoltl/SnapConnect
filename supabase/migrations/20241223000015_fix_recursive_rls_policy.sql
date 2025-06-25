-- Migration: Fix Recursive RLS Policy
-- Description: Drops the recursive Row Level Security policy on the chat_participants table
-- which was causing infinite recursion errors during storage operations.

DROP POLICY IF EXISTS "Users can view chat participants" ON public.chat_participants; 