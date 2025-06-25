# Feature Plan: Photo & Video Messaging

**Version**: 1.0
**Status**: Planned

This document outlines the implementation plan for adding photo and video messaging to SnapConnect, grounded in the established Product Requirements and Technical Architecture.

---

### **Backend**

| Priority | Task Description | Implementation Details & Justification | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | Create Supabase Storage Bucket & Policies | Create a bucket named `media`. Apply RLS policies to allow authenticated users to upload and read their own media. | Supabase Dashboard -> Storage -> Policies. <br> **SQL for Policy:** `CREATE POLICY "Allow authenticated media access" ON storage.objects FOR ALL USING (bucket_id = 'media' AND auth.role() = 'authenticated');` | None | Not Started |
| **High** | Create Multi-Send DB Function | Create a new PostgreSQL function `send_media_to_friends`. It will accept a `storage_path`, `content_type`, and an array of `recipient_ids`. Inside a transaction, it will loop through the IDs, call `getOrCreateDirectChat` for each, and insert the message record. **Justification**: This is the most efficient and reliable way to handle atomic, multi-recipient sends. | `supabase/migrations/` (new file) | `getOrCreateDirectChat` function | Not Started |

### **Frontend**

| Priority | Task Description | Implementation Details & Justification | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | Create Friend Selection Screen | Build the `SelectRecipientsScreen` to display a user's friend list with checkboxes. | `src/screens/SelectRecipientsScreen/` (new) | Friend Management | Not Started |
| **High** | Create Full-Screen Media Viewer Screen | Build a dedicated `MediaViewerScreen` that receives media details as route params to display full-screen media. | `src/screens/MediaViewerScreen/` (new) | - | Not Started |
| **High** | Update Navigation | Integrate both new screens into the root navigation stack. Modify `MediaPreviewScreen` to navigate to `SelectRecipientsScreen`. | `src/navigation/RootNavigation.tsx` | New Screens | Not Started |
| **High** | Implement Media Sending Service | The client-side service will upload the media file, then call the new `send_media_to_friends` RPC with the resulting path and selected friend IDs. | `src/services/chat.ts` (new function) | Multi-Send DB Function | Not Started |
| **High** | Implement Realtime Media Message Handling | Update the Supabase Realtime subscription handler to render a thumbnail when a new message with `content_type` of `'image'` or `'video'` arrives. | `src/stores/chatStore.ts` or `src/screens/ConversationScreen/index.tsx` | - | Not Started |
| **Medium** | Render Media Messages in Chat | In `ConversationScreen`, render a clickable thumbnail for media messages that navigates to the `MediaViewerScreen`. | `src/screens/ConversationScreen/index.tsx` | MediaViewerScreen | Not Started |
| **Low** | Enforce Video Constraints | In `CameraScreen`, use `expo-camera` props to limit video quality (720p) and duration (60s). | `src/screens/CameraScreen/index.tsx` | - | Not Started |

</rewritten_file> 