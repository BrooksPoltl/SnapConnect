-- Migration: Add phone field to profiles table
-- Description: Adds phone number field to support phone authentication
-- Author: SnapConnect Team
-- Date: 2025-01-01

-- Add phone field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT;

-- Create index for phone number searches
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON public.profiles(phone);

-- Add constraint to ensure phone format is valid (optional but recommended)
-- This allows various international phone number formats
ALTER TABLE public.profiles 
ADD CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$');

-- Update the handle_new_user function to not automatically create profiles
-- since we now handle profile creation in the app after phone verification
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Remove the trigger that automatically creates profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; 