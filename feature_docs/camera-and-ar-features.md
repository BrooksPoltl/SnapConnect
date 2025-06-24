# Camera & AR Features Plan

### Feature Summary

This document outlines the implementation plan for enhancing the SnapConnect
camera with video recording and a flexible Augmented Reality (AR) text overlay
feature. The goal is to provide users with an intuitive, Snapchat-like camera
experience and creative tools to add, edit, and manipulate text on their photos
and videos. The implementation is split into two phases: first, enabling core
video capture using `expo-camera`, and second, building the AR text editor.

### Technical Implementation Details

To achieve a fluid and powerful user experience, we will leverage a combination
of key libraries:

1.  **`expo-camera` & `expo-av`**: These will serve as the foundation for all
    media capture and playback. `expo-camera` is a robust, well-integrated
    library for high-quality photo and video capture. `expo-av` will be used for
    seamless video playback during the review process.

2.  **`react-native-skia`**: We will use Skia to build the AR text editing
    interface. Skia is a 2D graphics engine that allows for the creation of
    smooth, 60fps animations and interactions. It will power the UI for adding,
    moving, resizing, and rotating text on a canvas layered above the captured
    media.

3.  **`ffmpeg-kit-react-native`**: For videos, after the user has finished
    editing the text overlay in the Skia UI, FFmpeg will be used to "burn" the
    text permanently onto the video file. We will export the Skia text element
    as a transparent image and use FFmpeg to overlay it on the video.

This approach gives us a stable media capture system (`expo-camera`) and a
highly interactive editing UI (`react-native-skia`) combined with a powerful
media processing backend (`ffmpeg-kit-react-native`).

---

### Implementation Plan

#### Phase 1: Core Video Functionality

This phase focuses on enabling video recording and creating the preview screen
where all future editing will take place. It uses the existing `expo-camera`
library for stability and `expo-av` for video playback.

| Priority | Task Description                         | Implementation Details                                                                                                                                                                                                                                                                                      | Code Pointers (Proposed)                                                                                                                                                                                                                                                                                                                                                                                                                                 | Dependencies                                                                 | Status      |
| :------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :---------- | ------- |
| **High** | **Install Video Playback Library**       | Add `expo-av` to the project for handling video playback in the preview screen.                                                                                                                                                                                                                             | `package.json`                                                                                                                                                                                                                                                                                                                                                                                                                                           | None                                                                         | ☐ To Do     |
| **High** | **Update Camera UI for Video Recording** | Modify the capture button in `CameraActions` to handle two distinct gestures: <br> 1. **Tap:** Triggers `takePhoto()`. <br> 2. **Long-Press & Hold:** Triggers `startRecording()`. Releasing the button triggers `stopRecording()`. <br> An animated ring should appear around the button during recording. | `src/components/CameraActions/index.tsx`<br>`src/components/CameraActions/styles.ts`                                                                                                                                                                                                                                                                                                                                                                     | None                                                                         | ☐ To Do     |
| **High** | **Implement Video Recording Logic**      | In `CameraScreen`, use `expo-camera`'s `recordAsync()` and `stopRecording()` methods. Manage a new state variable, `isRecording`, to control the UI indicator. On successful recording, navigate to the `MediaPreviewScreen`.                                                                               | `src/screens/CameraScreen/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                     | UI Update                                                                    | ☐ To Do     |
| **High** | **Create Unified Media Preview Screen**  | Build a new `MediaPreviewScreen` that receives a `media` object (`{uri, type: 'photo'                                                                                                                                                                                                                       | 'video'}`).<br>- **Display**: Renders `<Image>`for photos and looping, autoplaying`<Video>` (`expo-av`) for videos.<br>- **Controls**: Include UI elements for:<br>  - **Discard:** A back/close button to navigate back to the `CameraScreen`.<br> - **Save:** A button to save the media to the device's gallery.<br> - **Next:** A button to proceed to the next step (sharing/editing).<br> - **Mute/Unmute:** An icon on the video to toggle sound. | `src/screens/MediaPreviewScreen/index.tsx`<br>`src/navigation/UserStack.tsx` | Video Logic | ☐ To Do |

#### Phase 2: AR Free-Text Feature

This phase implements the ability for users to add and edit a resizable, movable
text overlay to their captured media.

| Priority   | Task Description                      | Implementation Details                                                                                                                                                                                                                                 | Code Pointers (Proposed)                                                     | Dependencies       | Status  |
| :--------- | :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :----------------- | :------ |
| **High**   | Install & Configure Editing Libraries | Add `react-native-skia`, `ffmpeg-kit-react-native`, and `react-native-gesture-handler` to the project. Perform necessary native setup (e.g., `pod install`).                                                                                           | `package.json`, `ios/Podfile`                                                | All Phase 1 Tasks  | ☐ To Do |
| **High**   | Implement AR Text Editing UI          | On the `MediaPreviewScreen`, add an **"Aa" (Text) icon**. Tapping it adds a text input onto a `react-native-skia` canvas layered over the media. Use `react-native-gesture-handler` to enable drag, pinch-to-zoom, and rotation gestures for the text. | `src/components/MediaPreview/ARTextEditor.tsx`                               | Install Libraries  | ☐ To Do |
| **Medium** | Finalize Text on Images               | For photos, use Skia's `makeImageSnapshot()` method to capture the canvas (image + text overlay) and create a single, flattened image file.                                                                                                            | `src/screens/MediaPreviewScreen/index.tsx`                                   | AR Text Editing UI | ☐ To Do |
| **Medium** | Finalize Text on Videos               | 1. Export the final Skia text overlay as a transparent PNG. 2. Use `ffmpeg-kit-react-native` to run a command that burns the PNG overlay onto the video file. Display a loading indicator during this process.                                         | `src/services/VideoProcessor.ts`, `src/screens/MediaPreviewScreen/index.tsx` | AR Text Editing UI | ☐ To Do |
