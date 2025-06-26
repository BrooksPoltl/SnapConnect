# Task: Create `get_stories_feed` Database Function

**Status**: Implemented

## 1. Objective

To create an efficient PostgreSQL function, `get_stories_feed`, that retrieves
all active stories and groups them by author. This function will power the main
"stories bar" UI on the `StoriesScreen`, providing all necessary data in a
single network request.

## 2. Technical Approach

The function will be written in `pl/pgsql` and will return a JSON array. It will
run with `SECURITY INVOKER` permissions (the PostgreSQL default), which is a
critical security detail. This ensures that the existing Row Level Security
(RLS) policies on the `stories` table are automatically enforced for the user
calling the function. The database will correctly filter for stories that are
public or private-to-friends based on the caller's identity, preventing any data
leaks. The function then aggregates the visible stories by author and returns
them as a single JSON response.

## 3. Implementation Steps

### Step 1: Add Function to Migration File

The following SQL will be added to the new migration file created in the
previous step (`supabase/migrations/YYYYMMDDHHMMSS_add_stories_functions.sql`).

### Step 2: Define the `get_stories_feed` Function

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_stories_functions.sql

CREATE OR REPLACE FUNCTION public.get_stories_feed()
RETURNS JSON
LANGUAGE plpgsql
-- By omitting 'SECURITY DEFINER', the function defaults to 'SECURITY INVOKER'.
-- This is crucial for security as it ensures that the RLS policies on the
-- 'stories' table are enforced for the user who is calling the function.
AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'author_id', p.id,
                'username', p.username,
                'stories', (
                    -- This subquery is subject to RLS. The user will only see
                    -- stories they have permission to view (public, or private from friends).
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'storage_path', s.storage_path,
                            'media_type', s.media_type,
                            'created_at', s.created_at
                        ) ORDER BY s.created_at ASC
                    )
                    FROM public.stories s
                    WHERE s.author_id = p.id
                )
            )
        )
        -- The outer query gets all profiles that have at least one story *visible to the current user*.
        -- If a user only has private stories and the current user is not a friend, they won't appear in the feed.
        FROM public.profiles p
        WHERE p.id IN (SELECT DISTINCT author_id FROM public.stories)
    );
END;
$$;

-- Grant execution permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_stories_feed() TO authenticated;
```

## 4. Client-Side Interaction

The frontend will call this function via the Supabase client library. The return
type will need to be cast to the appropriate TypeScript interface.

```typescript
// src/services/stories.ts (example)
import { supabase } from './supabase';
import { StoryFeedItem } from '../types'; // Assuming types are defined

async function getStoriesFeed(): Promise<StoryFeedItem[]> {
  const { data, error } = await supabase.rpc('get_stories_feed');

  if (error) {
    console.error('Error fetching stories feed:', error);
    throw error;
  }
  // The data is returned as a single JSON object from the function.
  // If no stories exist, it might be null.
  return (data as StoryFeedItem[] | null) || [];
}
```

## 5. Dependencies

- The `public.stories` and `public.profiles` tables must exist.
- The RLS policies on `public.stories` must be active to ensure data privacy.
