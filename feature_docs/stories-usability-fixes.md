# Feature Plan: Stories - Usability & Visibility Fixes

This document outlines the plan to address key usability and visibility issues
with the Stories feature. The primary goals are to fix a critical bug preventing
friends from viewing stories and to implement a view-tracking mechanism to
improve the user experience.

## 1. The Bug: "Object Not Found" Error

A critical bug was identified where users could not view their friends' stories,
even if public. The application logs showed a
`StorageApiError: Object not found`, indicating that while the database record
for the story was accessible, the app was blocked from accessing the actual
image/video file in Supabase Storage.

**Root Cause**: The Row Level Security (RLS) policy on the `storage.objects`
table only granted access to media associated with `messages`, but not
`stories`. This needs to be expanded.

## 2. Implementation Plan

### Backend

| Priority | Task Description                           | Implementation Details                                                                                                                                                                                                                                                                                                                 | Code Pointers (Proposed)                                        | Dependencies        | Status  |
| :------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- | :------------------ | :------ |
| **High** | **Fix Storage Access Policy**              | **Crucial Fix:** Create a new migration to update the RLS policy on `storage.objects`. The policy will be expanded to grant SELECT access to a media file if it's linked in a story that the current user is permitted to see (i.e., public stories, or private stories from friends). This will resolve the `Object not found` error. | `supabase/migrations/` (new migration file)                     | `stories` table     | ☐ To Do |
| **High** | **Create `story_views` Table**             | Create a `public.story_views` table with `story_id` (FK to `stories.id`), `user_id` (FK to `profiles.id`), and `viewed_at` (TIMESTAMPTZ). Composite PK on (`story_id`, `user_id`). RLS policies will ensure users can only manage their own view records.                                                                              | `supabase/migrations/` (new migration file)                     | `stories` table     | ☐ To Do |
| **High** | **Create `mark_story_viewed` DB Function** | Create a new RPC function, `mark_story_viewed(p_story_id BIGINT)`, that inserts a record into the `story_views` table. This will be called from the app when a story is viewed.                                                                                                                                                        | `supabase/migrations/` (new migration file)                     | `story_views` table | ☐ To Do |
| **High** | **Update `get_stories_feed` DB Function**  | Modify the existing `get_stories_feed` function to join against the new `story_views` table. For each story, it will now return an additional `is_viewed` boolean flag. It will also return an `all_stories_viewed` flag for the entire user group.                                                                                    | `supabase/migrations/` (modify `..._add_stories_functions.sql`) | `story_views` table | ☐ To Do |

### Frontend

| Priority | Task Description                      | Implementation Details                                                                                                                                                                                                                               | Code Pointers (Proposed)                                                     | Dependencies      | Status  |
| :------- | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :---------------- | :------ |
| **High** | **Update Story Types**                | Update the `Story` interface to include the new `is_viewed: boolean` flag, and `StoryFeedItem` to include `all_stories_viewed: boolean`.                                                                                                             | `src/types/stories.ts`                                                       | Backend Changes   | ☐ To Do |
| **High** | **Update `stories` Service**          | Add a `markStoryViewed(storyId: number)` function to the service that calls the new backend RPC.                                                                                                                                                     | `src/services/stories.ts`                                                    | Backend RPC       | ☐ To Do |
| **High** | **Update `StoriesScreen` UI**         | In the story circle component, use the `username` to render an avatar with the user's initial, matching the logic in `ConversationListItem`. Use the `all_stories_viewed` flag to apply a "viewed" style to the avatar's border (e.g., a gray ring). | `src/screens/StoriesScreen/index.tsx`, `src/components/Avatar/` (or similar) | Updated Types     | ☐ To Do |
| **High** | **Enhance `StoryViewerScreen` Logic** | Implement logic to manage the `currentStoryIndex`. When a story is displayed, call `markStoryViewed(story.id)` if `!story.is_viewed`. Add controls (e.g., tapping screen edges) to navigate between multiple stories from the same user.             | `src/screens/StoryViewerScreen/index.tsx`                                    | `stories` Service | ☐ To Do |

</rewritten_file>
