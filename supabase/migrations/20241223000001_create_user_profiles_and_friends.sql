-- Migration: User Profiles and Friend Management
-- Description: Creates profiles and friendships tables with secure RLS policies
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER AUTHENTICATION SETUP
-- ============================================================================

-- Note: auth.users table is automatically created and managed by Supabase Auth
-- It contains: id (UUID), email, encrypted_password, email_confirmed_at, etc.
-- We don't need to create it manually, but we can verify it exists

-- Verify auth schema exists (it should be created automatically)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        RAISE EXCEPTION 'Auth schema not found. Make sure Supabase Auth is properly initialized.';
    END IF;
END $$;

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Create profiles table for public user data
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT score_non_negative CHECK (score >= 0)
);

-- Create index for username searches
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_score_idx ON public.profiles(score DESC);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
-- Allow users to read all public profile data
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Allow users to insert their own profile (triggered by auth signup)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update only their own username (not score)
DROP POLICY IF EXISTS "Users can update their own username" ON public.profiles;
CREATE POLICY "Users can update their own username" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FRIENDSHIPS TABLE
-- ============================================================================

-- Create friendships table for managing friend relationships
CREATE TABLE IF NOT EXISTS public.friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT different_users CHECK (user_id_1 != user_id_2),
    CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS friendships_user_id_1_idx ON public.friendships(user_id_1);
CREATE INDEX IF NOT EXISTS friendships_user_id_2_idx ON public.friendships(user_id_2);
CREATE INDEX IF NOT EXISTS friendships_status_idx ON public.friendships(status);

-- Enable RLS on friendships table
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friendships table
-- Users can view friendships where they are involved
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;
CREATE POLICY "Users can view their own friendships" ON public.friendships
    FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Users can only send friend requests (insert pending status)
DROP POLICY IF EXISTS "Users can send friend requests" ON public.friendships;
CREATE POLICY "Users can send friend requests" ON public.friendships
    FOR INSERT WITH CHECK (
        auth.uid() = user_id_1 
        AND status = 'pending'
    );

-- Users can only update friendships where they are the recipient
DROP POLICY IF EXISTS "Users can respond to friend requests" ON public.friendships;
CREATE POLICY "Users can respond to friend requests" ON public.friendships
    FOR UPDATE USING (auth.uid() = user_id_2)
    WITH CHECK (auth.uid() = user_id_2);

-- Users can delete friendships where they are involved
DROP POLICY IF EXISTS "Users can delete their friendships" ON public.friendships;
CREATE POLICY "Users can delete their friendships" ON public.friendships
    FOR DELETE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- ============================================================================
-- SECURE DATABASE FUNCTIONS
-- ============================================================================

-- Function to safely update username with validation
CREATE OR REPLACE FUNCTION public.update_username(new_username TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate input
    IF new_username IS NULL OR length(trim(new_username)) = 0 THEN
        RAISE EXCEPTION 'Username cannot be empty';
    END IF;
    
    IF length(new_username) < 3 OR length(new_username) > 30 THEN
        RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;
    
    IF new_username !~ '^[a-zA-Z0-9_]+$' THEN
        RAISE EXCEPTION 'Username can only contain letters, numbers, and underscores';
    END IF;
    
    -- Check if username is already taken
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username AND id != auth.uid()) THEN
        RAISE EXCEPTION 'Username is already taken';
    END IF;
    
    -- Update the username
    UPDATE public.profiles 
    SET 
        username = new_username,
        updated_at = NOW()
    WHERE id = auth.uid();
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found or you do not have permission to update it';
    END IF;
END;
$$;

-- Function to safely increment user score (called by triggers)
CREATE OR REPLACE FUNCTION public.increment_user_score(user_id UUID, points INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        score = score + points,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$;

-- Function to accept friend request
CREATE OR REPLACE FUNCTION public.accept_friend_request(request_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    friendship_record RECORD;
BEGIN
    -- Get the friendship record and verify the current user is the recipient
    SELECT * INTO friendship_record 
    FROM public.friendships 
    WHERE id = request_id AND user_id_2 = auth.uid() AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Friend request not found or you do not have permission to accept it';
    END IF;
    
    -- Update the friendship status
    UPDATE public.friendships 
    SET 
        status = 'accepted',
        updated_at = NOW()
    WHERE id = request_id;
END;
$$;

-- Function to decline friend request
CREATE OR REPLACE FUNCTION public.decline_friend_request(request_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    friendship_record RECORD;
BEGIN
    -- Get the friendship record and verify the current user is the recipient
    SELECT * INTO friendship_record 
    FROM public.friendships 
    WHERE id = request_id AND user_id_2 = auth.uid() AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Friend request not found or you do not have permission to decline it';
    END IF;
    
    -- Delete the friendship request
    DELETE FROM public.friendships WHERE id = request_id;
END;
$$;

-- Function to get suggested friends (random users not already friends)
CREATE OR REPLACE FUNCTION public.get_suggested_friends(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    username TEXT,
    score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.username, p.score
    FROM public.profiles p
    WHERE p.id != auth.uid()
    AND p.id NOT IN (
        -- Exclude existing friends and pending requests
        SELECT CASE 
            WHEN f.user_id_1 = auth.uid() THEN f.user_id_2
            ELSE f.user_id_1
        END
        FROM public.friendships f
        WHERE (f.user_id_1 = auth.uid() OR f.user_id_2 = auth.uid())
    )
    ORDER BY RANDOM()
    LIMIT limit_count;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for friendships updated_at
DROP TRIGGER IF EXISTS friendships_updated_at ON public.friendships;
CREATE TRIGGER friendships_updated_at
    BEFORE UPDATE ON public.friendships
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_name TEXT;
BEGIN
    -- Extract username from user metadata or email
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
    );
    
    -- Ensure username is valid and unique
    IF user_name IS NULL OR length(trim(user_name)) < 3 THEN
        user_name := 'user_' || substr(NEW.id::text, 1, 8);
    END IF;
    
    -- Make username unique if it already exists
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = user_name) LOOP
        user_name := user_name || '_' || floor(random() * 1000)::text;
    END LOOP;
    
    -- Create the profile
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, user_name);
    
    RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to create user profile atomically (called from client during signup)
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    user_username TEXT,
    user_score INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate input
    IF user_username IS NULL OR length(trim(user_username)) = 0 THEN
        RAISE EXCEPTION 'Username cannot be empty';
    END IF;
    
    IF length(user_username) < 3 OR length(user_username) > 30 THEN
        RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;
    
    IF user_username !~ '^[a-zA-Z0-9_]+$' THEN
        RAISE EXCEPTION 'Username can only contain letters, numbers, and underscores';
    END IF;
    
    -- Check if username is already taken
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = user_username) THEN
        RAISE EXCEPTION 'Username is already taken';
    END IF;
    
    -- Check if user already has a profile
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
        RAISE EXCEPTION 'User profile already exists';
    END IF;
    
    -- Create the profile
    INSERT INTO public.profiles (id, username, score)
    VALUES (user_id, user_username, user_score);
END;
$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.friendships TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_username(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_friend_request(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decline_friend_request(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_suggested_friends(INTEGER) TO authenticated;

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================

-- You can add any initial data here if needed
-- For example, create some test users or default settings

COMMENT ON TABLE public.profiles IS 'User profiles with public information';
COMMENT ON TABLE public.friendships IS 'Friend relationships between users';
COMMENT ON FUNCTION public.create_user_profile(UUID, TEXT, INTEGER) IS 'Atomically create user profile during signup';
COMMENT ON FUNCTION public.update_username(TEXT) IS 'Safely update username with validation';
COMMENT ON FUNCTION public.accept_friend_request(BIGINT) IS 'Accept a pending friend request';
COMMENT ON FUNCTION public.decline_friend_request(BIGINT) IS 'Decline a pending friend request';
COMMENT ON FUNCTION public.get_suggested_friends(INTEGER) IS 'Get random suggested friends for the current user'; 