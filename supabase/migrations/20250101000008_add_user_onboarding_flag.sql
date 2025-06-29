-- Migration: Add User Onboarding Flag
-- Description: Adds has_completed_onboarding column to profiles table for tracking first-time user onboarding
-- Author: Fathom Research Team
-- Date: 2025-01-01

-- ============================================================================
-- ADD ONBOARDING FLAG TO PROFILES TABLE
-- ============================================================================

-- Add has_completed_onboarding column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for efficient queries on onboarding status
CREATE INDEX IF NOT EXISTS profiles_onboarding_status_idx ON public.profiles(has_completed_onboarding);

-- ============================================================================
-- CREATE FUNCTION TO UPDATE ONBOARDING STATUS
-- ============================================================================

-- Function to mark user as having completed onboarding
CREATE OR REPLACE FUNCTION public.mark_onboarding_complete()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update the current user's onboarding status
    UPDATE public.profiles 
    SET 
        has_completed_onboarding = TRUE,
        updated_at = NOW()
    WHERE id = auth.uid();
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found or you do not have permission to update it';
    END IF;
END;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.mark_onboarding_complete() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.mark_onboarding_complete() IS 'Mark the current user as having completed the onboarding flow';
COMMENT ON COLUMN public.profiles.has_completed_onboarding IS 'Flag indicating whether the user has completed the initial onboarding flow'; 