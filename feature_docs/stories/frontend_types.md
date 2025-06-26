# Task: Update TypeScript Types

**Status**: Implemented

## 1. Objective

To define and export the necessary TypeScript types and interfaces for the
Stories feature. Creating clear, strongly-typed data structures is essential for
ensuring type safety, improving developer experience, and preventing bugs when
handling data from the Supabase API.

## 2. Technical Approach

A new file, `src/types/stories.ts`, will be created to house all interfaces
related to the Stories feature. These new types will then be exported from the
main `src/types/index.ts` barrel file for easy importing across the application.

## 3. Implementation Steps

### Step 1: Create New Type Definition File

Create a new file at `src/types/stories.ts`.

### Step 2: Define Story-Related Interfaces

The following interfaces will be added to the new file. They are designed to
match the data structures returned by the `get_stories_feed` database function.

```typescript
// src/types/stories.ts

/**
 * Represents a single story item (photo or video).
 * This corresponds to a record in the `public.stories` table.
 */
export interface Story {
  id: number;
  storage_path: string;
  media_type: 'image' | 'video';
  created_at: string; // ISO 8601 date string
}

/**
 * Represents an item in the stories feed, which is a user
 * and the collection of all their active stories.
 * This corresponds to the JSON object returned by the `get_stories_feed` function.
 */
export interface StoryFeedItem {
  author_id: string; // UUID
  username: string;
  stories: Story[];
}
```

### Step 3: Export from Barrel File

The new types will be exported from `src/types/index.ts` to make them accessible
to the rest of the application.

```typescript
// src/types/index.ts

// ... existing exports
export * from './stories';
```

## 4. Usage Example

These types will be used to type the state and props in our React components and
service functions.

```typescript
// src/services/stories.ts (example)
import { StoryFeedItem } from '../types';

async function getStoriesFeed(): Promise<StoryFeedItem[]> {
  // ... function implementation
}

// src/screens/StoriesScreen/index.tsx (example)
import { StoryFeedItem } from '../../types';
const [stories, setStories] = useState<StoryFeedItem[]>([]);
```

## 5. Dependencies

- None. This task only involves creating type definitions.
