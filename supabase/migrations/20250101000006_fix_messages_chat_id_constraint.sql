-- Fix NOT NULL constraint on chat_id column in messages table
-- This allows group messages to have NULL chat_id while maintaining data integrity
-- through the existing message_type_check constraint

-- Remove the NOT NULL constraint from chat_id column
ALTER TABLE public.messages 
ALTER COLUMN chat_id DROP NOT NULL; 