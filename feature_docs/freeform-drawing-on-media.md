# Feature: Free-form Drawing on Media

This document outlines the implementation plan for adding a free-form drawing
feature to the media preview screen. This will allow users to draw on top of
photos and videos before sharing them.

## Implementation Plan

| Priority   | Task Description                                           | Implementation Details                                                                                                                                                                                                                                         | Code Pointers                                                                        | Dependencies                      | Completion |
| :--------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :-------------------------------- | :--------- |
| **High**   | **1. Create `DrawingCanvas` component**                    | Create a new component that uses Skia's `<Canvas>` and `<Path>` to draw lines. It will receive the user's touch input to create and update paths. It should overlay the media content.                                                                         | `src/components/DrawingCanvas/index.tsx`, `src/components/DrawingCanvas/styles.ts`   | `@shopify/react-native-skia`      | [x]        |
| **High**   | **2. Implement free-form drawing logic**                   | In `DrawingCanvas`, use `useTouchHandler` or `GestureDetector` from `react-native-gesture-handler` to track finger movements. On touch start, create a new path. On touch move, add points to the current path. The paths will be stored in a state array.     | `src/components/DrawingCanvas/index.tsx`                                             | `react-native-gesture-handler`    | [x]        |
| **Medium** | **3. Create `DrawingToolbar` component**                   | Create a UI component that contains tools for drawing. Initially, it will hold the color palette, an undo button, and an eraser button. It could be positioned at the top or bottom of the screen.                                                             | `src/components/DrawingToolbar/index.tsx`, `src/components/DrawingToolbar/styles.ts` | -                                 | [x]        |
| **Medium** | **4. Implement Color Selection**                           | Add a color palette to the `DrawingToolbar`. When a color is selected, update the color property for the _next_ path created on the `DrawingCanvas`. Pass the selected color from the toolbar to the canvas component.                                         | `src/components/DrawingToolbar/index.tsx`, `src/components/DrawingCanvas/index.tsx`  | `DrawingToolbar`, `DrawingCanvas` | [x]        |
| **Medium** | **5. Implement Undo Functionality**                        | Add an "Undo" button to the `DrawingToolbar`. When pressed, it should remove the last completed path from the array of paths in the `DrawingCanvas`'s state.                                                                                                   | `src/components/DrawingCanvas/index.tsx`, `src/components/DrawingToolbar/index.tsx`  | `DrawingCanvas` logic             | [x]        |
| **Low**    | **6. Implement Eraser Functionality**                      | Add an "Eraser" button. When active, new paths should use a `BlendMode.Clear` to "erase" parts of other paths. This will require managing the active tool state (pen vs. eraser).                                                                              | `src/components/DrawingCanvas/index.tsx`, `src/components/DrawingToolbar/index.tsx`  | `DrawingCanvas` logic             | [ ]        |
| **High**   | **7. Integrate drawing feature into `MediaPreviewScreen`** | Add a "Draw" icon/button to the `MediaPreviewScreen`'s UI. Tapping it will show the `DrawingCanvas` and `DrawingToolbar`, enabling drawing mode. The `DrawingCanvas` will need to be wrapped in a `View` with the photo/video so it can be snapshotted.        | `src/screens/MediaPreviewScreen/index.tsx`                                           | `DrawingCanvas`, `DrawingToolbar` | [x]        |
| **High**   | **8. Install and implement `react-native-view-shot`**      | ~~Run `npx expo install react-native-view-shot`. In `MediaPreviewScreen`, create a `ref` for the `View` that contains both the media and the `DrawingCanvas`.~~                                                                                                | ~~`package.json`, `src/screens/MediaPreviewScreen/index.tsx`~~                       | -                                 | [⚠️]       |
| **High**   | **9. Save and export the edited media**                    | ~~When the user proceeds to send the media, call `captureRef` from `react-native-view-shot` on the container view's ref. This will produce a single image URI of the combined view, which can then be passed to our existing `media` service to be uploaded.~~ | ~~`src/screens/MediaPreviewScreen/index.tsx`, `src/services/media.ts`~~              | ~~`react-native-view-shot`~~      | [⚠️]       |

## Current Status & Limitations

**✅ Completed Features:**

- Drawing canvas with smooth gesture handling
- Color selection toolbar (white, black, red, green, blue)
- Undo functionality
- Toggle drawing mode on/off
- Full integration with MediaPreviewScreen

**⚠️ Current Limitation:**

- **Drawing Capture**: Due to Expo Go compatibility constraints, drawings are
  displayed as an overlay but are not captured in the final saved/sent image.
  The drawings are visible during editing but won't appear in the shared media.

**🔮 Future Enhancements:** To enable drawing capture, consider:

1. Using Expo Development Build with `react-native-view-shot`
2. Implementing server-side image composition
3. Using alternative capture methods compatible with Expo Go
