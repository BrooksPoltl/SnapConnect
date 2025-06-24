# Camera & AR Features Plan

### Feature Summary

This document outlines the implementation plan for enhancing the SnapConnect
camera with video recording and a flexible Augmented Reality (AR) text overlay
feature. The goal is to provide users with a high-performance camera experience
and creative tools to add, edit, and manipulate text on their photos and videos.
The implementation is split into two phases: first, enabling core video capture,
and second, building the AR text editor.

### Technical Implementation Details

To achieve a fluid and powerful user experience, we will leverage a combination
of three key libraries:

1.  **`react-native-vision-camera`**: This will serve as the foundation for all
    camera-related functionality. It is a modern, high-performance library that
    provides the necessary APIs for high-quality photo and video capture, as
    well as control over device features like the flash and front/rear cameras.

2.  **`react-native-skia`**: We will use Skia to build the AR text editing
    interface. Skia is a 2D graphics engine that allows for the creation of
    smooth, 60fps animations and interactions. It will power the UI for adding,
    moving, resizing, and rotating text on a canvas layered above the captured
    media. This provides a unified and highly performant editing experience for
    both images and videos.

3.  **`ffmpeg-kit-react-native`**: For videos, after the user has finished
    editing the text overlay in the Skia UI, FFmpeg will be used to "burn" the
    text permanently onto the video file. We will export the Skia text element
    as a transparent image and use FFmpeg to overlay it on the video. While this
    library increases the app's size, it is the most robust and reliable
    solution for video manipulation in React Native.

This hybrid approach gives us a highly interactive editing UI (Skia) combined
with a powerful media processing backend (FFmpeg), ensuring a feature-rich and
future-proof implementation.

---

### Implementation Plan

#### Phase 1: Core Video Functionality

This phase focuses on enabling video recording and creating the preview screen
where all future editing will take place.

| Priority | Task Description                | Implementation Details                                                                                                                                                                                           | Code Pointers (Proposed)                   | Dependencies          | Status  |
| :------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- | :-------------------- | :------ |
| **High** | Update Camera UI for Video      | Modify the capture button to support both a quick tap for photos and a long-press-and-hold action to record video. A visual indicator should show that recording is in progress (e.g., a red animating ring).    | `src/components/CameraControls/index.tsx`  | None                  | ☐ To Do |
| **High** | Implement Video Recording Logic | Use `react-native-vision-camera`'s `startRecording` and `stopRecording` methods. The component state will manage the recording status. A 60-second timer should automatically stop the recording.                | `src/screens/CameraScreen/index.tsx`       | Camera UI Update      | ☐ To Do |
| **High** | Create Media Preview Screen     | Build a new screen that can display both captured photos (`<Image>`) and videos (`react-native-video`). This screen will contain the UI for canceling the post, adding edits, or proceeding to the sharing step. | `src/screens/MediaPreviewScreen/index.tsx` | Video Recording Logic | ☐ To Do |

#### Phase 2: AR Free-Text Feature

This phase implements the ability for users to add and edit a resizable, movable
text overlay to their captured media.

| Priority   | Task Description                      | Implementation Details                                                                                                                                                                                                                                 | Code Pointers (Proposed)                                                     | Dependencies       | Status  |
| :--------- | :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :----------------- | :------ |
| **High**   | Install & Configure Editing Libraries | Add `react-native-skia`, `ffmpeg-kit-react-native`, and `react-native-gesture-handler` to the project. Perform necessary native setup (e.g., `pod install`).                                                                                           | `package.json`, `ios/Podfile`                                                | All Phase 1 Tasks  | ☐ To Do |
| **High**   | Implement AR Text Editing UI          | On the `MediaPreviewScreen`, add an **"Aa" (Text) icon**. Tapping it adds a text input onto a `react-native-skia` canvas layered over the media. Use `react-native-gesture-handler` to enable drag, pinch-to-zoom, and rotation gestures for the text. | `src/components/MediaPreview/ARTextEditor.tsx`                               | Install Libraries  | ☐ To Do |
| **Medium** | Finalize Text on Images               | For photos, use Skia's `makeImageSnapshot()` method to capture the canvas (image + text overlay) and create a single, flattened image file.                                                                                                            | `src/screens/MediaPreviewScreen/index.tsx`                                   | AR Text Editing UI | ☐ To Do |
| **Medium** | Finalize Text on Videos               | 1. Export the final Skia text overlay as a transparent PNG. 2. Use `ffmpeg-kit-react-native` to run a command that burns the PNG overlay onto the video file. Display a loading indicator during this process.                                         | `src/services/VideoProcessor.ts`, `src/screens/MediaPreviewScreen/index.tsx` | AR Text Editing UI | ☐ To Do |
