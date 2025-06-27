-- Fix ambiguous column reference in create_group function
-- The variable name 'group_id' conflicts with column names in the tables

-- Function to create a new group (fixed version)
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
    new_group_id BIGINT;  -- Renamed from 'group_id' to avoid ambiguity
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
    RETURNING id INTO new_group_id;
    
    -- Add the creator as a member
    INSERT INTO public.group_members (group_id, user_id)
    VALUES (new_group_id, current_user_id);
    
    -- Add other members
    IF p_member_ids IS NOT NULL THEN
        FOREACH member_id IN ARRAY p_member_ids
        LOOP
            -- Skip if trying to add creator again
            IF member_id != current_user_id THEN
                INSERT INTO public.group_members (group_id, user_id)
                VALUES (new_group_id, member_id)
                ON CONFLICT (group_id, user_id) DO NOTHING;
            END IF;
        END LOOP;
    END IF;
    
    RETURN new_group_id;
END;
$$; 