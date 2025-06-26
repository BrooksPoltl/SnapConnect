# Feature Plan: Story Management and Viewing Enhancements

This document outlines the implementation plan for enhancing the Stories feature. The goals are to provide story creators with tools to manage their content, track views, and to fix critical visibility bugs.

### 1. User Requirements

-   **View Own Stories**: A user must be able to view their own active stories.
-   **View Analytics**: The story creator must be able to see a total view count and a list of which users have viewed their story.
-   **Delete Stories**: The creator must have a prominent and clear way to delete their own stories.
-   **UX Confirmation**: Deletion will require a confirmation pop-up to prevent accidents.
-   **UX for Viewers**: The list of viewers will be presented in a clean, modern UI pattern like a bottom sheet.
-   **UX for Navigation**: While viewing their own stories, a creator should be able to navigate between all of their own active stories, similar to the experience of watching another user's stories.

### 2. Backend

| Priority | Task Description | Implementation Details | Code Pointers (Proposed) | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Fix Storage Access Policy for Stories** | **Critical Bug Fix:** Update the RLS policy on `storage.objects`. The policy must be expanded to grant `SELECT` access to a media file if it's linked in a story that the current user is permitted to see (i.e., public stories, or private stories from friends). This resolves "Object not found" errors. | `supabase/migrations/` (new file) | `stories` table | ☐ To Do |
| **High** | **Create `story_views` Table & RLS** | Create a `public.story_views` table with `story_id` (FK to `stories.id`), `user_id` (FK to `profiles.id`), and `viewed_at` (TIMESTAMPTZ). Add a composite primary key on (`story_id`, `user_id`). RLS policies will ensure users can only insert/delete their own view records. | `supabase/migrations/` (new file) | `stories` table | ☐ To Do |
| **High** | **Create `mark_story_viewed` DB Function** | Create a new RPC function, `mark_story_viewed(p_story_id BIGINT)`, that inserts a record into the `story_views` table. This will be called from the app when a user views a story for the first time. | `supabase/migrations/` (new file) | `story_views` table | ☐ To Do |
| **High** | **Create `delete_story` DB Function** | Create an RPC function `delete_story(p_story_id BIGINT)` that deletes records from `stories` and `story_views`, and also removes the associated media file from Supabase Storage. This must be a `SECURITY DEFINER` function and must validate that the caller is the story's author. | `supabase/migrations/` (new file) | `stories`, `story_views` tables | ☐ To Do |
| **High** | **Update `get_stories_feed` DB Function** | Modify the existing `get_stories_feed` function to join against the new `story_views` table. For each story, it will now return an additional `is_viewed` boolean flag for the current user. It will also return an `all_stories_viewed` flag for the entire user group to improve the UI. | `supabase/migrations/` (modify existing) | `story_views` table | ☐ To Do |
| **High** | **Create `get_story_viewers` DB Function** | Create an RPC function, `get_story_viewers(p_story_id BIGINT)`, that returns the total view count and a list of viewers (username, user_id, etc.). This function must be secured so only the story's author can call it. | `supabase/migrations/` (new file) | `story_views`, `profiles` tables | ☐ To Do |

### 3. Frontend

| Priority | Task Description | Implementation Details | Code Pointers (Proposed) | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Update Story Types** | Update the `Story` type to include `is_viewed: boolean`. Update `StoryFeedItem` to include `all_stories_viewed: boolean`. Create a `StoryViewer` type (`username`, `user_id`, `avatar_url`) and a `MyStoryDetails` type (`view_count`, `viewers: StoryViewer[]`). | `src/types/stories.ts` | Backend Changes | ☐ To Do |
| **High** | **Update `stories` Service** | Add `markStoryViewed(storyId)`, `deleteStory(storyId)`, and `getStoryViewers(storyId)` functions to the service to call the new backend RPCs. | `src/services/stories.ts` | Backend RPCs | ☐ To Do |
| **High** | **Update `StoriesScreen` UI** | In the story circle component, use the `all_stories_viewed` flag to apply a "viewed" style (e.g., gray border). Differentiate the user's own story circle and navigate to the new management screen on tap. | `src/screens/StoriesScreen/index.tsx` | Updated Types | ☐ To Do |
| **High** | **Enhance `StoryViewerScreen`** | This screen is for viewing others' stories. When it loads, call `markStoryViewed(story.id)` if `!story.is_viewed`. Implement controls (e.g., tapping screen edges) to navigate between multiple stories from the same user. | `src/screens/StoryViewerScreen/index.tsx` | `stories` Service | ☐ To Do |
| **High** | **Create `MyStoryViewerScreen`** | Create a new screen for story owners. It will: 1. Display the story content. 2. Fetch and display the view count. 3. Show a list of viewers in a slide-up bottom sheet. 4. Have a prominent "Delete" button with a confirmation dialog. 5. Allow tap/swipe navigation between the user's own active stories. | `src/screens/MyStoryViewerScreen/` | `stories` Service | ☐ To Do |
| **High** | **Update Navigation** | Add `MyStoryViewerScreen` to the `UserStack`. Update `StoriesScreen` navigation logic to route to `StoryViewerScreen` or `MyStoryViewerScreen` based on whether the user is the story's author. | `src/navigation/UserStack.tsx`, `src/types/navigation.ts` | New Screen | ☐ To Do | 