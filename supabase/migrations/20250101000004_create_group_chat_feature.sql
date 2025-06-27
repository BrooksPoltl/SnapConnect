-- Migration: Group Chat Feature
-- Description: Adds group chat functionality with groups, group members, and read receipts
-- Author: SnapConnect Team
-- Date: 2025-01-01

-- ============================================================================
-- GROUPS TABLE
-- ============================================================================

-- Create groups table for group metadata
CREATE TABLE IF NOT EXISTS public.groups (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS groups_creator_id_idx ON public.groups(creator_id);
CREATE INDEX IF NOT EXISTS groups_created_at_idx ON public.groups(created_at);

-- ============================================================================
-- GROUP MEMBERS TABLE
-- ============================================================================

-- Create group_members table for many-to-many relationship between groups and users
CREATE TABLE IF NOT EXISTS public.group_members (
    group_id BIGINT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (group_id, user_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS group_members_user_id_idx ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS group_members_group_id_idx ON public.group_members(group_id);

-- ============================================================================
-- GROUP READ RECEIPTS TABLE
-- ============================================================================

-- Create group_read_receipts table to track when users last read messages in groups
CREATE TABLE IF NOT EXISTS public.group_read_receipts (
    group_id BIGINT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (group_id, user_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS group_read_receipts_group_id_idx ON public.group_read_receipts(group_id);
CREATE INDEX IF NOT EXISTS group_read_receipts_user_id_idx ON public.group_read_receipts(user_id);

-- ============================================================================
-- ALTER MESSAGES TABLE FOR GROUP SUPPORT
-- ============================================================================

-- Add group_id column to messages table (nullable for backwards compatibility)
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS group_id BIGINT REFERENCES public.groups(id) ON DELETE CASCADE;

-- Create index for efficient group message queries
CREATE INDEX IF NOT EXISTS messages_group_id_idx ON public.messages(group_id);

-- Add constraint to ensure a message is either a direct message OR a group message, not both
ALTER TABLE public.messages 
ADD CONSTRAINT message_type_check CHECK (
    (chat_id IS NOT NULL AND group_id IS NULL) OR 
    (chat_id IS NULL AND group_id IS NOT NULL)
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_read_receipts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR GROUPS
-- ============================================================================

-- Users can view groups they are members of
CREATE POLICY "Users can view their groups" ON public.groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can create groups
CREATE POLICY "Users can create groups" ON public.groups
    FOR INSERT WITH CHECK (creator_id = auth.uid());

-- Users can update groups they are members of (for group name changes)
CREATE POLICY "Users can update their groups" ON public.groups
    FOR UPDATE USING (
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can delete groups they created
CREATE POLICY "Users can delete groups they created" ON public.groups
    FOR DELETE USING (creator_id = auth.uid());

-- ============================================================================
-- RLS POLICIES FOR GROUP MEMBERS
-- ============================================================================

-- Users can view members of groups they belong to
CREATE POLICY "Users can view group members" ON public.group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

-- Users can add themselves to groups (when invited)
CREATE POLICY "Users can join groups" ON public.group_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can leave groups (delete their own membership)
CREATE POLICY "Users can leave groups" ON public.group_members
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES FOR GROUP READ RECEIPTS
-- ============================================================================

-- Users can view their own read receipts
CREATE POLICY "Users can view their own read receipts" ON public.group_read_receipts
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert/update their own read receipts
CREATE POLICY "Users can manage their own read receipts" ON public.group_read_receipts
    FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- UPDATE MESSAGES RLS POLICIES FOR GROUP SUPPORT
-- ============================================================================

-- Drop existing message viewing policy to update it
DROP POLICY IF EXISTS "Users can view messages in their chats with TTL" ON public.messages;

-- Create new policy that supports both direct messages and group messages
CREATE POLICY "Users can view messages in their chats and groups with TTL" ON public.messages
    FOR SELECT USING (
        (
            -- Direct messages: user must be a participant in the chat
            chat_id IS NOT NULL AND chat_id IN (
                SELECT chat_id FROM public.chat_participants 
                WHERE user_id = auth.uid()
            )
        ) OR (
            -- Group messages: user must be a member of the group
            group_id IS NOT NULL AND group_id IN (
                SELECT group_id FROM public.group_members 
                WHERE user_id = auth.uid()
            )
        )
        -- AND message must not be expired (24 hours after being viewed, or unread)
        AND (
            viewed_at IS NULL  -- Unread messages never expire
            OR viewed_at > (NOW() - INTERVAL '24 hours')  -- Read messages expire after 24 hours
        )
    );

-- Update message insertion policy to support group messages
DROP POLICY IF EXISTS "Users can send messages to their chats" ON public.messages;

CREATE POLICY "Users can send messages to their chats and groups" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND (
            -- Direct messages: user must be a participant in the chat
            (chat_id IS NOT NULL AND chat_id IN (
                SELECT chat_id FROM public.chat_participants 
                WHERE user_id = auth.uid()
            )) OR
            -- Group messages: user must be a member of the group
            (group_id IS NOT NULL AND group_id IN (
                SELECT group_id FROM public.group_members 
                WHERE user_id = auth.uid()
            ))
        )
    );

-- ============================================================================
-- GROUP FUNCTIONS
-- ============================================================================

-- Function to create a new group
CREATE OR REPLACE FUNCTION public.create_group(
    p_group_name TEXT,
    p_member_ids UUID[]
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    group_id BIGINT;
    member_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Validate group name
    IF p_group_name IS NULL OR length(trim(p_group_name)) = 0 THEN
        RAISE EXCEPTION 'Group name cannot be empty';
    END IF;
    
    -- Create the group
    INSERT INTO public.groups (name, creator_id)
    VALUES (trim(p_group_name), current_user_id)
    RETURNING id INTO group_id;
    
    -- Add the creator as a member
    INSERT INTO public.group_members (group_id, user_id)
    VALUES (group_id, current_user_id);
    
    -- Add other members
    IF p_member_ids IS NOT NULL THEN
        FOREACH member_id IN ARRAY p_member_ids
        LOOP
            -- Skip if trying to add creator again
            IF member_id != current_user_id THEN
                INSERT INTO public.group_members (group_id, user_id)
                VALUES (group_id, member_id)
                ON CONFLICT (group_id, user_id) DO NOTHING;
            END IF;
        END LOOP;
    END IF;
    
    RETURN group_id;
END;
$$;

-- Function to send a message to a group
CREATE OR REPLACE FUNCTION public.send_group_message(
    p_group_id BIGINT,
    p_content_text TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    message_id BIGINT;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a member of this group
    IF NOT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = p_group_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to send messages to this group';
    END IF;
    
    -- Validate message content
    IF p_content_text IS NULL OR length(trim(p_content_text)) = 0 THEN
        RAISE EXCEPTION 'Message content cannot be empty';
    END IF;
    
    -- Insert the message
    INSERT INTO public.messages (group_id, sender_id, content_type, content_text)
    VALUES (p_group_id, current_user_id, 'text', trim(p_content_text))
    RETURNING id INTO message_id;
    
    -- Update group's updated_at timestamp
    UPDATE public.groups 
    SET updated_at = NOW() 
    WHERE id = p_group_id;
    
    RETURN message_id;
END;
$$;

-- Function to get messages for a specific group
CREATE OR REPLACE FUNCTION public.get_group_messages(
    p_group_id BIGINT, 
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id BIGINT,
    sender_id UUID,
    sender_username TEXT,
    content_type TEXT,
    content_text TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    is_own_message BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a member of this group
    IF NOT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = p_group_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to access this group';
    END IF;
    
    RETURN QUERY
    SELECT 
        m.id,
        m.sender_id,
        p.username as sender_username,
        m.content_type,
        m.content_text,
        m.storage_path,
        m.created_at,
        m.viewed_at,
        (m.sender_id = current_user_id) as is_own_message
    FROM public.messages m
    JOIN public.profiles p ON p.id = m.sender_id
    WHERE m.group_id = p_group_id
        -- Apply TTL policy: unread messages or read within 24 hours
        AND (
            m.viewed_at IS NULL 
            OR m.viewed_at > (NOW() - INTERVAL '24 hours')
        )
    ORDER BY m.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Function to get user's groups with last message and unread count
CREATE OR REPLACE FUNCTION public.get_user_groups()
RETURNS TABLE (
    group_id BIGINT,
    group_name TEXT,
    creator_id UUID,
    member_count INTEGER,
    last_message_id BIGINT,
    last_message_content TEXT,
    last_message_sender_id UUID,
    last_message_sender_username TEXT,
    last_message_created_at TIMESTAMPTZ,
    unread_count INTEGER,
    last_activity TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    RETURN QUERY
    WITH user_groups AS (
        -- Get all groups the current user is a member of
        SELECT DISTINCT gm.group_id
        FROM public.group_members gm
        WHERE gm.user_id = current_user_id
    ),
    group_details AS (
        -- Get group details and member count
        SELECT 
            g.id as group_id,
            g.name as group_name,
            g.creator_id,
            g.created_at,
            g.updated_at,
            (SELECT COUNT(*) FROM public.group_members gm2 WHERE gm2.group_id = g.id)::INTEGER as member_count
        FROM public.groups g
        WHERE g.id IN (SELECT ug.group_id FROM user_groups ug)
    ),
    last_messages AS (
        -- Get the most recent message for each group
        SELECT DISTINCT ON (m.group_id)
            m.group_id,
            m.id as message_id,
            m.content_text as content,
            m.sender_id,
            p.username as sender_username,
            m.created_at
        FROM public.messages m
        JOIN public.profiles p ON p.id = m.sender_id
        WHERE m.group_id IN (SELECT ug.group_id FROM user_groups ug)
        ORDER BY m.group_id, m.created_at DESC
    ),
    unread_counts AS (
        -- Count unread messages for each group
        SELECT 
            m.group_id,
            COUNT(*) as unread_count
        FROM public.messages m
        LEFT JOIN public.group_read_receipts grr ON grr.group_id = m.group_id AND grr.user_id = current_user_id
        WHERE m.group_id IN (SELECT ug.group_id FROM user_groups ug)
        AND m.sender_id != current_user_id  -- Messages from others
        AND (grr.last_read_at IS NULL OR m.created_at > grr.last_read_at)  -- Not yet read
        AND (m.viewed_at IS NULL OR m.viewed_at > (NOW() - INTERVAL '24 hours')) -- Within TTL
        GROUP BY m.group_id
    )
    SELECT 
        gd.group_id,
        gd.group_name,
        gd.creator_id,
        gd.member_count,
        COALESCE(lm.message_id, 0) as last_message_id,
        lm.content as last_message_content,
        lm.sender_id as last_message_sender_id,
        lm.sender_username as last_message_sender_username,
        lm.created_at as last_message_created_at,
        COALESCE(uc.unread_count, 0)::INTEGER as unread_count,
        COALESCE(lm.created_at, gd.updated_at) as last_activity
    FROM group_details gd
    LEFT JOIN last_messages lm ON lm.group_id = gd.group_id
    LEFT JOIN unread_counts uc ON uc.group_id = gd.group_id
    ORDER BY last_activity DESC NULLS LAST;
END;
$$;

-- Function to add members to a group
CREATE OR REPLACE FUNCTION public.add_group_members(
    p_group_id BIGINT,
    p_member_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    member_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a member of this group
    IF NOT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = p_group_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to add members to this group';
    END IF;
    
    -- Add each member
    IF p_member_ids IS NOT NULL THEN
        FOREACH member_id IN ARRAY p_member_ids
        LOOP
            INSERT INTO public.group_members (group_id, user_id)
            VALUES (p_group_id, member_id)
            ON CONFLICT (group_id, user_id) DO NOTHING;
        END LOOP;
    END IF;
END;
$$;

-- Function to leave a group
CREATE OR REPLACE FUNCTION public.leave_group(p_group_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Remove user from group
    DELETE FROM public.group_members 
    WHERE group_id = p_group_id AND user_id = current_user_id;
    
    -- Clean up read receipts
    DELETE FROM public.group_read_receipts 
    WHERE group_id = p_group_id AND user_id = current_user_id;
END;
$$;

-- Function to mark group messages as read
CREATE OR REPLACE FUNCTION public.mark_group_messages_as_read(p_group_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    current_user_id := auth.uid();
    
    -- Verify user is a member of this group
    IF NOT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = p_group_id AND user_id = current_user_id
    ) THEN
        RAISE EXCEPTION 'You do not have permission to access this group';
    END IF;
    
    -- Update or insert read receipt
    INSERT INTO public.group_read_receipts (group_id, user_id, last_read_at)
    VALUES (p_group_id, current_user_id, NOW())
    ON CONFLICT (group_id, user_id) 
    DO UPDATE SET last_read_at = NOW();
END;
$$;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Add updated_at trigger for groups table
DROP TRIGGER IF EXISTS groups_updated_at ON public.groups;
CREATE TRIGGER groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ENABLE REALTIME FOR GROUP MESSAGES
-- ============================================================================

-- Messages table is already enabled for realtime, group messages will automatically be included

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions on new tables
GRANT ALL ON public.groups TO authenticated;
GRANT ALL ON public.group_members TO authenticated;
GRANT ALL ON public.group_read_receipts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on new functions
GRANT EXECUTE ON FUNCTION public.create_group(TEXT, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_group_message(BIGINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_group_messages(BIGINT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_groups() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_group_members(BIGINT, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.leave_group(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_group_messages_as_read(BIGINT) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.groups IS 'Group chat conversations';
COMMENT ON TABLE public.group_members IS 'Many-to-many relationship between groups and users';
COMMENT ON TABLE public.group_read_receipts IS 'Tracks when users last read messages in groups';
COMMENT ON FUNCTION public.create_group(TEXT, UUID[]) IS 'Create a new group with initial members';
COMMENT ON FUNCTION public.send_group_message(BIGINT, TEXT) IS 'Send a text message to a group';
COMMENT ON FUNCTION public.get_group_messages(BIGINT, INTEGER) IS 'Get messages for a specific group';
COMMENT ON FUNCTION public.get_user_groups() IS 'Get user''s groups with last message and unread count';
COMMENT ON FUNCTION public.add_group_members(BIGINT, UUID[]) IS 'Add new members to an existing group';
COMMENT ON FUNCTION public.leave_group(BIGINT) IS 'Leave a group (remove membership)';
COMMENT ON FUNCTION public.mark_group_messages_as_read(BIGINT) IS 'Mark all messages in a group as read'; 