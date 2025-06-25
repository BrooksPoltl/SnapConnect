-- Migration: Messaging and Stories Features
-- Description: Creates tables for real-time chat and ephemeral stories with TTL policies
-- Author: SnapConnect Team
-- Date: 2024-12-23

-- ============================================================================
-- CHATS AND MESSAGES TABLES
-- ============================================================================

-- Create chats table for conversation metadata
CREATE TABLE IF NOT EXISTS public.chats (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_participants table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.chat_participants (
    chat_id BIGINT NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (chat_id, user_id)
);

-- Create messages table for chat messages and media
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
    content_text TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT message_content_check CHECK (
        (content_type = 'text' AND content_text IS NOT NULL AND storage_path IS NULL) OR
        (content_type IN ('image', 'video') AND storage_path IS NOT NULL AND content_text IS NULL)
    )
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS chats_created_at_idx ON public.chats(created_at);
CREATE INDEX IF NOT EXISTS chat_participants_user_id_idx ON public.chat_participants(user_id);
CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats table
-- Users can only see chats they participate in
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (
        id IN (
            SELECT chat_id FROM public.chat_participants 
            WHERE user_id = auth.uid()
        )
    );

-- Users can create new chats
CREATE POLICY "Users can create chats" ON public.chats
    FOR INSERT WITH CHECK (true);

-- RLS Policies for chat_participants table
-- Users can view participants of chats they're in
CREATE POLICY "Users can view chat participants" ON public.chat_participants
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM public.chat_participants 
            WHERE user_id = auth.uid()
        )
    );

-- Users can add themselves to chats
CREATE POLICY "Users can join chats" ON public.chat_participants
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for messages table
-- Users can only see messages in chats they participate in
-- AND messages must be less than 24 hours old (TTL policy)
CREATE POLICY "Users can view recent messages in their chats" ON public.messages
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM public.chat_participants 
            WHERE user_id = auth.uid()
        )
        AND created_at > (NOW() - INTERVAL '24 hours')
    );

-- Users can send messages to chats they participate in
CREATE POLICY "Users can send messages to their chats" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND chat_id IN (
            SELECT chat_id FROM public.chat_participants 
            WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- STORIES TABLE
-- ============================================================================

-- Create stories table for ephemeral content
CREATE TABLE IF NOT EXISTS public.stories (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    privacy TEXT NOT NULL CHECK (privacy IN ('public', 'private_friends')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add metadata for media
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    width INTEGER,
    height INTEGER,
    duration INTEGER -- in seconds, for videos
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS stories_author_id_idx ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS stories_privacy_idx ON public.stories(privacy);

-- Enable RLS on stories table
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stories table
-- Users can view stories that are:
-- 1. Less than 24 hours old (TTL policy)
-- 2. Either public OR private but user is friends with author
CREATE POLICY "Users can view recent accessible stories" ON public.stories
    FOR SELECT USING (
        created_at > (NOW() - INTERVAL '24 hours')
        AND (
            privacy = 'public'
            OR (
                privacy = 'private_friends'
                AND EXISTS (
                    SELECT 1 FROM public.friendships f
                    WHERE f.status = 'accepted'
                    AND (
                        (f.user_id_1 = auth.uid() AND f.user_id_2 = author_id)
                        OR (f.user_id_2 = auth.uid() AND f.user_id_1 = author_id)
                    )
                )
            )
        )
    );

-- Users can create their own stories
CREATE POLICY "Users can create their own stories" ON public.stories
    FOR INSERT WITH CHECK (author_id = auth.uid());

-- Users can delete their own stories
CREATE POLICY "Users can delete their own stories" ON public.stories
    FOR DELETE USING (author_id = auth.uid());

-- ============================================================================
-- SCORING TRIGGERS
-- ============================================================================

-- Trigger to increment score when user sends a message
CREATE OR REPLACE FUNCTION public.increment_score_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Increment user score by 5 points for sending a message
    PERFORM public.increment_user_score(NEW.sender_id, 5);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_increment_score ON public.messages;
CREATE TRIGGER messages_increment_score
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_score_on_message();

-- Trigger to increment score when user posts a story
CREATE OR REPLACE FUNCTION public.increment_score_on_story()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Increment user score by 10 points for posting a story
    PERFORM public.increment_user_score(NEW.author_id, 10);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stories_increment_score ON public.stories;
CREATE TRIGGER stories_increment_score
    AFTER INSERT ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_score_on_story();

-- ============================================================================
-- MESSAGING HELPER FUNCTIONS
-- ============================================================================

-- Function to create a direct message chat between two users
CREATE OR REPLACE FUNCTION public.create_direct_chat(other_user_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    chat_id BIGINT;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    -- Check if users are friends
    IF NOT EXISTS (
        SELECT 1 FROM public.friendships f
        WHERE f.status = 'accepted'
        AND (
            (f.user_id_1 = current_user_id AND f.user_id_2 = other_user_id)
            OR (f.user_id_2 = current_user_id AND f.user_id_1 = other_user_id)
        )
    ) THEN
        RAISE EXCEPTION 'You can only create chats with friends';
    END IF;
    
    -- Check if chat already exists between these users
    SELECT c.id INTO chat_id
    FROM public.chats c
    WHERE c.id IN (
        SELECT cp1.chat_id
        FROM public.chat_participants cp1
        JOIN public.chat_participants cp2 ON cp1.chat_id = cp2.chat_id
        WHERE cp1.user_id = current_user_id 
        AND cp2.user_id = other_user_id
        GROUP BY cp1.chat_id
        HAVING COUNT(*) = 2
    );
    
    -- If chat doesn't exist, create it
    IF chat_id IS NULL THEN
        INSERT INTO public.chats DEFAULT VALUES RETURNING id INTO chat_id;
        
        -- Add both users as participants
        INSERT INTO public.chat_participants (chat_id, user_id) VALUES 
            (chat_id, current_user_id),
            (chat_id, other_user_id);
    END IF;
    
    RETURN chat_id;
END;
$$;

-- Function to get user's chat list
CREATE OR REPLACE FUNCTION public.get_user_chats()
RETURNS TABLE (
    chat_id BIGINT,
    other_user_id UUID,
    other_username TEXT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    unread_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as chat_id,
        other_participant.user_id as other_user_id,
        p.username as other_username,
        latest_msg.content_text as last_message,
        latest_msg.created_at as last_message_at,
        0 as unread_count -- TODO: Implement read receipts
    FROM public.chats c
    JOIN public.chat_participants my_participation ON c.id = my_participation.chat_id
    JOIN public.chat_participants other_participant ON c.id = other_participant.chat_id
    JOIN public.profiles p ON other_participant.user_id = p.id
    LEFT JOIN LATERAL (
        SELECT content_text, content_type, created_at
        FROM public.messages m
        WHERE m.chat_id = c.id
        AND m.created_at > (NOW() - INTERVAL '24 hours')
        ORDER BY m.created_at DESC
        LIMIT 1
    ) latest_msg ON true
    WHERE my_participation.user_id = auth.uid()
    AND other_participant.user_id != auth.uid()
    ORDER BY COALESCE(latest_msg.created_at, c.created_at) DESC;
END;
$$;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Add updated_at triggers for new tables
DROP TRIGGER IF EXISTS chats_updated_at ON public.chats;
CREATE TRIGGER chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions on new tables
GRANT ALL ON public.chats TO authenticated;
GRANT ALL ON public.chat_participants TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.stories TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on new functions
GRANT EXECUTE ON FUNCTION public.create_direct_chat(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_chats() TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.chats IS 'Chat conversations between users';
COMMENT ON TABLE public.chat_participants IS 'Many-to-many relationship between chats and users';
COMMENT ON TABLE public.messages IS 'Messages in chats - disappear after 24 hours';
COMMENT ON TABLE public.stories IS 'User stories - disappear after 24 hours';
COMMENT ON FUNCTION public.create_direct_chat(UUID) IS 'Create or get existing direct message chat between friends';
COMMENT ON FUNCTION public.get_user_chats() IS 'Get user''s chat list with latest message info'; 