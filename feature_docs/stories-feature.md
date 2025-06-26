# Feature Plan: Ephemeral Stories

**Version**: 1.0 **Status**: Implemented

This document outlines the implementation plan for adding an ephemeral stories
feature to SnapConnect. This allows users to post photo and video updates that
disappear after 24 hours. The implementation is based on the established Product
Requirements and Technical Architecture.

**Note on Technical Debt**: This plan intentionally defers the implementation of
a permanent data cleanup job. While Row Level Security (RLS) policies will make
stories invisible to users after 24 hours, the underlying data and media files
will remain in the database and storage, which may lead to increased costs and
data accumulation over time. A scheduled cleanup function should be implemented
in the future to address this.

---

### **Backend**

| Priority | Task Description                          | Task Document                                | Code Pointers (Proposed) | Dependencies    | Status      |
| :------- | :---------------------------------------- | :------------------------------------------- | :----------------------- | :-------------- | :------ |
| **High** | **Create `post_story` DB Function**       | [View Plan](./stories/backend_post_story.md) | `supabase/migrations/`   | `stories` Table | ✅ Done |
| **High** | **Create `get_stories_feed` DB Function** | [View Plan](./stories/backend_get_feed.md)   | `supabase/migrations/`   | `stories` Table | ✅ Done |

### **Frontend**

| Priority | Task Description                 | Task Document                                           | Code Pointers (Proposed)                     | Dependencies      | Status      |
| :------- | :------------------------------- | :------------------------------------------------------ | :------------------------------------------- | :---------------- | :------ |
| **High** | **Update Types**                 | [View Plan](./stories/frontend_types.md)                | `src/types/stories.ts`, `src/types/index.ts` | -                 | ✅ Done |
| **High** | **Create `stories` Service**     | [View Plan](./stories/frontend_service.md)              | `src/services/stories.ts`                    | Backend Functions | ✅ Done |
| **High** | **Update `MediaPreviewScreen`**  | [View Plan](./stories/frontend_media_preview_screen.md) | `src/screens/MediaPreviewScreen/index.tsx`   | `stories` Service | ✅ Done |
| **High** | **Implement `StoriesScreen` UI** | [View Plan](./stories/frontend_stories_screen.md)       | `src/screens/StoriesScreen/index.tsx`        | `stories` Service | ✅ Done |
| **High** | **Create `StoryViewerScreen`**   | [View Plan](./stories/frontend_story_viewer_screen.md)  | `src/screens/StoryViewerScreen/`             | -                 | ✅ Done |
| **High** | **Update Navigation**            | [View Plan](./stories/frontend_navigation.md)           | `src/navigation/UserStack.tsx`               | New Screens       | ✅ Done |

</rewritten_file>
