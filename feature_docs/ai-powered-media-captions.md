### **Feature: AI-Powered Media Captions**

**Objective:** To automatically generate descriptive captions for photos and
transcribe audio for videos, allowing users to quickly add context to their
media before sharing. This will be triggered by a user action on the
`MediaPreviewScreen`.

**Summary:** This feature will introduce AI-powered captions for photos and
videos. Users will be able to tap a button on the media preview screen to
automatically generate a caption. For photos, OpenAI's `gpt-4o` model will
analyze the image content to create a descriptive caption. For videos, the audio
track will be extracted and transcribed using OpenAI's `whisper-1` model. The
implementation will involve creating two new secure Supabase Edge Functions for
the backend and updating the frontend `MediaPreviewScreen` to include the
trigger UI and service calls.

---

### **Backend Tasks (Supabase)**

| Priority | Task Description                                  | Implementation Details                                                                                                                                                                                                   | Code Pointers                                            | Dependencies | Status |
| :------- | :------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- | :----------- | :----- |
| **High** | **Create `generate-photo-caption` Edge Function** | Create a new Supabase Edge Function that accepts a base64-encoded image. The function will call the OpenAI API using the `gpt-4o` model to generate a caption. The OpenAI API key should be stored as a Supabase secret. | `supabase/functions/generate-photo-caption/index.ts`     | None         | To Do  |
| **High** | **Create `transcribe-video-audio` Edge Function** | Create a new Supabase Edge Function that accepts an audio file. This function will use the OpenAI `whisper-1` model to transcribe the audio into text.                                                                   | `supabase/functions/transcribe-video-audio/index.ts`     | None         | To Do  |
| **High** | **Secure Edge Functions**                         | Ensure both new Edge Functions are protected and can only be invoked by authenticated users. This involves checking the user's JWT from the authorization header.                                                        | Function invocation logic within each new Edge Function. | None         | To Do  |

---

### **Frontend Tasks (React Native App)**

| Priority   | Task Description                          | Implementation Details                                                                                                                                                                                               | Code Pointers                                                                          | Dependencies                        | Status |
| :--------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :---------------------------------- | :----- |
| **High**   | **Add "Generate AI Caption" UI**          | On the `MediaPreviewScreen`, add a new icon or button (e.g., with a "sparkle" icon) that users can tap to trigger caption generation. This button should have a loading state to provide feedback.                   | `src/screens/MediaPreviewScreen/index.tsx`, `src/screens/MediaPreviewScreen/styles.ts` | None                                | To Do  |
| **High**   | **Create AI Service Module**              | Create a new file to handle communication with the new Supabase Edge Functions. This service will contain two functions: `generatePhotoCaption` and `transcribeVideoAudio`.                                          | `src/services/ai.ts`, `src/services/index.ts`                                          | Backend Functions                   | To Do  |
| **High**   | **Implement Photo Caption Logic**         | When the button is tapped for a photo, get the local image URI, convert it to base64, and call `generatePhotoCaption`. On success, populate the existing caption input with the result. Manage loading/error states. | `src/screens/MediaPreviewScreen/index.tsx`                                             | AI Service Module                   | To Do  |
| **Medium** | **Add Audio Extraction Logic for Videos** | Integrate a library like `expo-av` to extract the audio track from the video URI. This will be required before calling the transcription service.                                                                    | `src/screens/MediaPreviewScreen/index.tsx`                                             | -                                   | To Do  |
| **High**   | **Implement Video Transcription Logic**   | When the button is tapped for a video, extract the audio, and call `transcribeVideoAudio`. On success, populate the existing caption input with the transcribed text. Manage loading/error states.                   | `src/screens/MediaPreviewScreen/index.tsx`                                             | Audio Extraction, AI Service Module | To Do  |
| **Medium** | **Add AI-Related Types**                  | Define TypeScript types for the requests and responses for the new AI services.                                                                                                                                      | `src/types/ai.ts`, `src/types/index.ts`                                                | None                                | To Do  |
