-- Migration: Add chat_type to chats table
-- Description: Adds the missing chat_type column to the chats table to distinguish
-- between direct messages and group chats.

ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS chat_type TEXT DEFAULT 'direct';

-- Backfill existing chats to ensure they have a type
UPDATE public.chats SET chat_type = 'direct' WHERE chat_type IS NULL;

-- Make the column non-nullable going forward
ALTER TABLE public.chats ALTER COLUMN chat_type SET NOT NULL; 