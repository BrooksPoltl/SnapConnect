### **Feature: Photo Captions**

**Objective:** Allow users to add a simple text caption to photos on the
`MediaPreviewScreen`. The caption will be permanently rendered onto the image
using Skia. This feature will only apply to photos for the initial
implementation.

---

### **Tasks**

| Priority | Task Description                  | Implementation Details                                                                                                                                                                                         | Code Pointers                                                                                 | Dependencies              | Status   |
| :------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :------------------------ | :------- |
| **High** | **FE: Install Skia**              | Add the `@shopify/react-native-skia` library to the project and complete any native configuration steps for iOS and Android.                                                                                   | `package.json`, `ios/Podfile`                                                                 | None                      | To Do    |
| **High** | **FE: Create Caption Input**      | On `MediaPreviewScreen`, implement a UI where tapping the screen reveals a `TextInput`. The user can type their caption and tap away to dismiss it. The input should have a semi-transparent black background. | `src/screens/MediaPreviewScreen/index.tsx`                                                    | Install Skia              | To Do    |
| **High** | **FE: Render Caption onto Photo** | When the user proceeds to send the photo, use a Skia Canvas to draw the original photo and overlay the caption text. Generate a new local URI for the combined image.                                          | `src/screens/MediaPreviewScreen/index.tsx`, `src/services/media.ts`                           | Create Caption Input      | To Do    |
| **High** | **FE: Update Sending Logic**      | Modify the media sending functions to use the new image URI (with the burned-in caption) for both stories and chat messages.                                                                                   | `src/screens/MediaPreviewScreen/index.tsx`, `src/services/stories.ts`, `src/services/chat.ts` | Render Caption onto Photo | To Do    |
| **N/A**  | **BE: No Database Changes**       | Since the caption is part of the image file, no changes are needed to the `stories` or `messages` tables in Supabase.                                                                                          | `supabase/migrations/`                                                                        | None                      | Complete |
