-- Migration: Merge Duplicate Chats
-- Description: A one-time script to find, merge, and delete duplicate direct chats
-- between pairs of users, ensuring one unified conversation thread.
-- Author: SnapConnect Team
-- Date: 2024-12-24

-- ============================================================================
-- SCRIPT TO MERGE DUPLICATE CHATS
-- ============================================================================

DO $$
DECLARE
    user_pair RECORD;
    target_chat_id BIGINT;
    duplicate_chat_ids BIGINT[];
BEGIN
    RAISE NOTICE 'Starting duplicate chat merge process...';

    -- Find all pairs of users who have more than one direct chat together
    FOR user_pair IN
        SELECT
            LEAST(cp1.user_id, cp2.user_id) as user_a,
            GREATEST(cp1.user_id, cp2.user_id) as user_b,
            ARRAY_AGG(cp1.chat_id) as chat_ids,
            COUNT(DISTINCT cp1.chat_id) as chat_count
        FROM public.chat_participants cp1
        JOIN public.chat_participants cp2 ON cp1.chat_id = cp2.chat_id AND cp1.user_id <> cp2.user_id
        GROUP BY LEAST(cp1.user_id, cp2.user_id), GREATEST(cp1.user_id, cp2.user_id)
        HAVING COUNT(DISTINCT cp1.chat_id) > 1
    LOOP
        RAISE NOTICE 'Found duplicate chats for users % and %', user_pair.user_a, user_pair.user_b;

        -- Designate the oldest chat as the target to merge into
        SELECT MIN(c.id) INTO target_chat_id
        FROM public.chats c
        WHERE c.id = ANY(user_pair.chat_ids);

        RAISE NOTICE 'Target chat ID for merge: %', target_chat_id;

        -- Get the list of chat IDs to be merged and deleted
        SELECT ARRAY_AGG(id) INTO duplicate_chat_ids
        FROM public.chats
        WHERE id = ANY(user_pair.chat_ids) AND id <> target_chat_id;

        RAISE NOTICE 'Duplicate chat IDs to be merged: %', duplicate_chat_ids;

        -- Re-assign messages from duplicate chats to the target chat
        UPDATE public.messages
        SET chat_id = target_chat_id
        WHERE chat_id = ANY(duplicate_chat_ids);

        RAISE NOTICE 'Re-assigned messages from duplicates to target chat.';

        -- Delete the now-empty duplicate chat participants
        DELETE FROM public.chat_participants
        WHERE chat_id = ANY(duplicate_chat_ids);

        RAISE NOTICE 'Deleted participant entries for duplicate chats.';

        -- Delete the now-empty duplicate chats
        DELETE FROM public.chats
        WHERE id = ANY(duplicate_chat_ids);

        RAISE NOTICE 'Deleted duplicate chat entries.';
    END LOOP;

    RAISE NOTICE 'Duplicate chat merge process completed.';
END;
$$;
