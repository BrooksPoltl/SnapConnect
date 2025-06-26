# Task: Create `stories` Service

**Status**: Implemented

## 1. Objective

To create a dedicated service module at `src/services/stories.ts` that
encapsulates all client-side logic for interacting with the Stories feature's
backend functions. This follows the project's established pattern of separating
API-related concerns into modular services.

## 2. Technical Approach

The service will be a standard TypeScript module exporting async functions. It
will use the singleton `supabase` client instance from
`src/services/supabase.ts` to perform its operations. This service will be
responsible for uploading media to Supabase Storage and calling the `post_story`
and `get_stories_feed` RPCs.

## 3. Implementation Steps

### Step 1: Create New Service File

Create a new file at `src/services/stories.ts`.

### Step 2: Implement Service Functions

The following functions will be added to the new service file.

```typescript
// src/services/stories.ts

import { supabase } from './supabase';
import { StoryFeedItem } from '../types';
import { decode } from 'base64-arraybuffer';

// A helper to generate a unique file path for storage
const generateStoryFilePath = (
  userId: string,
  mediaType: 'image' | 'video',
) => {
  const fileExtension = mediaType === 'image' ? 'jpg' : 'mp4';
  return `${userId}/story_${new Date().toISOString()}.${fileExtension}`;
};

/**
 * Fetches the user's stories feed from the backend.
 * @returns A promise that resolves to an array of StoryFeedItem objects.
 */
export async function getStoriesFeed(): Promise<StoryFeedItem[]> {
  const { data, error } = await supabase.rpc('get_stories_feed');

  if (error) {
    console.error('Error fetching stories feed:', error);
    throw new Error(error.message);
  }

  return (data as StoryFeedItem[] | null) || [];
}

/**
 * Posts a new story. This involves uploading the media to storage and then
 * calling the post_story RPC to record it in the database.
 * @param mediaUri - The local file URI of the photo or video.
 * @param mediaType - The type of media ('image' or 'video').
 * @param privacy - The privacy setting for the story ('public' or 'private_friends').
 * @param userId - The ID of the user posting the story.
 */
export async function postStory(
  mediaUri: string,
  mediaType: 'image' | 'video',
  privacy: 'public' | 'private_friends',
  userId: string,
): Promise<void> {
  // 1. Generate a unique file path
  const filePath = generateStoryFilePath(userId, mediaType);

  // 2. Read the file from the local URI and upload to Supabase Storage
  // Note: This step might need a helper function to read the file into a buffer,
  // depending on the filesystem access provided by React Native/Expo.
  // For simplicity, we assume `mediaUri` can be converted to a blob or buffer.
  const response = await fetch(mediaUri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, blob);

  if (uploadError) {
    console.error('Error uploading story media:', uploadError);
    throw new Error(uploadError.message);
  }

  // 3. Call the database function to create the story record
  const { error: rpcError } = await supabase.rpc('post_story', {
    p_storage_path: filePath,
    p_media_type: mediaType,
    p_privacy: privacy,
  });

  if (rpcError) {
    // Attempt to clean up the uploaded file if the DB insert fails
    await supabase.storage.from('media').remove([filePath]);
    console.error('Error creating story record:', rpcError);
    throw new Error(rpcError.message);
  }
}
```

### Step 3: Export from Barrel File

Export the new service from `src/services/index.ts`.

```typescript
// src/services/index.ts

// ... existing exports
export * from './stories';
```

## 4. Dependencies

- `src/services/supabase.ts`: For the configured Supabase client.
- `src/types/stories.ts`: For the `StoryFeedItem` type.
- `base64-arraybuffer`: A utility that might be needed for file uploads
  depending on the final implementation.
- Backend RPCs: `post_story` and `get_stories_feed` must be deployed in the
  database.
- Supabase Storage: The `media` bucket must exist.
