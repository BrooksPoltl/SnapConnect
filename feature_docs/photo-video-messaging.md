# Feature Plan: Photo & Video Messaging

**Version**: 1.1 **Status**: Implemented

This document outlines the implementation plan for adding photo and video
messaging to SnapConnect, grounded in the established Product Requirements and
Technical Architecture. All planned features are now complete.

---

### **Backend**

| Priority | Task Description                          | Implementation Details & Justification                                                                                                                                                                                                                                                                                                                                        | Code Pointers                                                    | Dependencies                     | Status |
| :------- | :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :------------------------------- | :----- |
| **High** | Create Supabase Storage Bucket & Policies | Create a bucket named `media`. Apply RLS policies to allow authenticated users to upload and read their own media. Implemented via migration.                                                                                                                                                                                                                                 | `supabase/migrations/..._add_send_media_to_friends_function.sql` | None                             | Done   |
| **High** | Create Multi-Send DB Function             | Create a new PostgreSQL function `send_media_to_friends`. It will accept a `storage_path`, `content_type`, and an array of `recipient_ids`. Inside a transaction, it will loop through the IDs, call `getOrCreateDirectChat` for each, and insert the message record. **Justification**: This is the most efficient and reliable way to handle atomic, multi-recipient sends. | `supabase/migrations/..._add_send_media_to_friends_function.sql` | `getOrCreateDirectChat` function | Done   |

### **Frontend**

| Priority   | Task Description                          | Implementation Details & Justification                                                                                                                                                                     | Code Pointers                                 | Dependencies           | Status |
| :--------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :--------------------- | :----- |
| **High**   | Create Friend Selection Screen            | Built the `SelectRecipientsScreen` to display a user's friend list with checkboxes. A "Send" button becomes active when at least one friend is selected.                                                   | `src/screens/SelectRecipientsScreen/`         | Friend Management      | Done   |
| **High**   | Create Full-Screen Media Viewer Screen    | Built a dedicated `MediaViewerScreen` that receives media details as route params to display full-screen media. It includes a timer that automatically closes the screen after a few seconds.              | `src/screens/MediaViewerScreen/`              | -                      | Done   |
| **High**   | Update Navigation                         | Integrated both new screens into the `UserStack`. Modified `MediaPreviewScreen` to navigate to `SelectRecipientsScreen`.                                                                                   | `src/navigation/UserStack.tsx`                | New Screens            | Done   |
| **High**   | Implement Media Sending Service           | The client-side service in `chat.ts` uploads the media file, then calls the `send_media_to_friends` RPC with the resulting path and selected friend IDs. This supports an optimistic "fire and forget" UI. | `src/services/chat.ts` (`sendMediaToFriends`) | Multi-Send DB Function | Done   |
| **High**   | Implement Realtime Media Message Handling | The `chatStore` now handles optimistic UI updates by adding a local message with a `file://` URI and a "sending" status. Realtime updates replace this with the permanent message from the backend.        | `src/stores/chatStore.ts`                     | -                      | Done   |
| **Medium** | Render Media Messages in Chat             | In `ConversationScreen`, a new component renders a clickable thumbnail for media messages. Clicking it navigates to the `MediaViewerScreen`.                                                               | `src/screens/ConversationScreen/index.tsx`    | MediaViewerScreen      | Done   |
| **Low**    | Enforce Video Constraints                 | In `CameraScreen`, used `expo-camera` props to limit video quality (720p) and duration (60s).                                                                                                              | `src/screens/CameraScreen/index.tsx`          | -                      | Done   |
