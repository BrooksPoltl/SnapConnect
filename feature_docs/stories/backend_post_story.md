# Task: Create `post_story` Database Function

**Status**: Planning

## 1. Objective

To create a secure and reliable PostgreSQL function in Supabase, `post_story`, that allows an authenticated user to insert a new record into the `stories` table. This function will serve as the primary RPC for creating new stories from the client-side application.

## 2. Technical Approach

The function will be written in `pl/pgsql` and defined with `SECURITY DEFINER` to ensure it runs with the necessary permissions to `INSERT` into the `stories` table while still leveraging the `auth.uid()` of the calling user for ownership. It will accept the media's storage path, type, and the user-defined privacy level as arguments.

The existing `increment_score_on_story` trigger on the `stories` table will automatically handle awarding the user 10 points, so no explicit score logic is needed in this function.

## 3. Implementation Steps

### Step 1: Create a New Migration File

A new SQL migration file will be created in the `supabase/migrations/` directory to contain the function definition.

### Step 2: Define the `post_story` Function

The following SQL will be added to the new migration file.

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_stories_functions.sql

CREATE OR REPLACE FUNCTION public.post_story(
    p_storage_path TEXT,
    p_media_type TEXT, -- 'image' or 'video'
    p_privacy TEXT -- 'public' or 'private_friends'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Input validation to ensure required parameters are provided.
    IF p_storage_path IS NULL OR trim(p_storage_path) = '' THEN
        RAISE EXCEPTION 'storage_path cannot be empty';
    END IF;

    IF p_media_type NOT IN ('image', 'video') THEN
        RAISE EXCEPTION 'Invalid media_type. Must be ''image'' or ''video''.';
    END IF;

    IF p_privacy NOT IN ('public', 'private_friends') THEN
        RAISE EXCEPTION 'Invalid privacy level. Must be ''public'' or ''private_friends''.';
    END IF;

    -- Insert the new story record into the public.stories table.
    -- The author_id is securely obtained from the session's authenticated user.
    INSERT INTO public.stories (author_id, storage_path, media_type, privacy)
    VALUES (auth.uid(), p_storage_path, p_media_type, p_privacy);
END;
$$;

-- Grant execution permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.post_story(TEXT, TEXT, TEXT) TO authenticated;
```

## 4. Client-Side Interaction

The frontend will call this function via the Supabase client library:

```typescript
// src/services/stories.ts (example)
import { supabase } from './supabase';

async function postStory(storagePath: string, mediaType: 'image' | 'video', privacy: 'public' | 'private_friends') {
  const { error } = await supabase.rpc('post_story', {
    p_storage_path: storagePath,
    p_media_type: mediaType,
    p_privacy: privacy,
  });

  if (error) {
    console.error('Error posting story:', error);
    throw error;
  }
  return;
}
```

## 5. Dependencies

-   The `public.stories` table must exist with the correct schema as defined in `20241223000002_create_messaging_and_stories.sql`.
-   The `increment_score_on_story` trigger must be active on the `stories` table. 