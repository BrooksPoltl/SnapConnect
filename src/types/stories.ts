/**
 * Represents a single story item (photo or video).
 * This corresponds to a record in the `public.stories` table.
 */
export interface Story {
  id: number;
  storage_path: string;
  media_type: 'image' | 'video';
  created_at: string; // ISO 8601 date string
  is_viewed: boolean;
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
  all_stories_viewed: boolean;
}

/**
 * Represents a user who has viewed a story.
 */
export interface StoryViewer {
  user_id: string;
  username: string;
  viewed_at: string;
}

/**
 * Represents the analytics for a single story, including
 * the total view count and a list of viewers.
 */
export interface MyStoryAnalytics {
  view_count: number;
  viewers: StoryViewer[];
}
