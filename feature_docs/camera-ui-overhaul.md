# Feature: Camera Experience UI Overhaul

This document outlines the plan to modernize the user interface for the core camera experience in the SnapConnect app. The goal is to replace the current bland and unprofessional UI with a clean, modern, and consistent design system.

## 1. Color Palette

The new color palette is inspired by modern fintech applications like Robinhood, with a stronger emphasis on blue to establish a unique and trustworthy brand identity.

### Light Theme
- `primary`: **#0052FF** (Strong Blue)
- `background`: **#F8F9FA** (Light Gray)
- `surface`: **#FFFFFF** (White)
- `text`: **#1D2329** (Dark Slate Gray)
- `textSecondary`: **#6C757D** (Mid Gray)
- `border`: **#E9ECEF** (Subtle Border)

### Dark Theme
- `primary`: **#409CFF** (Bright Blue)
- `background`: **#161B22** (Deep Blue-Gray)
- `surface`: **#21262D** (Dark Slate)
- `text`: **#F0F6FC** (Off-White)
- `textSecondary`: **#8B949E** (Dim Gray)
- `border`: **#30363D** (Subtle Border)

## 2. Iconography

All existing emoji and text-based icons will be replaced with the professional and consistent [Feather Icons](https://feathericons.com/) library.

### Icon Replacement Map

| Component        | Original        | Feather Icon      | Notes                                    |
| :--------------- | :-------------- | :---------------- | :--------------------------------------- |
| `CameraActions`  | 📁 (Gallery)    | `image`           |                                          |
| `CameraActions`  | 🔄 (Flip Camera)  | `refresh-cw`      | Clockwise variant.                       |
| `ReturnButton`   | `<` (Back)      | `arrow-left`      |                                          |
| `PhotoPreview`   | "Save" button   | `download`        | Icon will be placed next to "Save" text. |
| `PhotoPreview`   | "Share" button  | `send`            | Text changed to "Send".                  |
| `PhotoPreview`   | "Discard" button| `trash-2`         | Icon will be placed next to "Discard" text.|
| `CameraOptions`  | 🔄 (Flip Camera)  | `refresh-ccw`     | Counter-clockwise variant per request.   |
| `CameraOptions`  | ⚡/🔦 (Flash)    | `zap` / `zap-off` | State-dependent icon.                    |
| `CameraOptions`  | 🎥 (Video)      | `video`           |                                          |
| `CameraOptions`  | 🎵 (Music)      | `music`           |                                          |
| `CameraOptions`  | 🌙 (Night mode)   | `moon`            |                                          |

## 3. Task Breakdown

The implementation will be done screen-by-screen, starting with the foundational elements and then updating each component in the camera flow.

| Priority | Task                               | Implementation Details                                                                                                                                                       | Code Pointers                                                                                                 | Dependencies           | Status      |
| :------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :--------------------- | :---------- |
| **High** | **Setup Foundational Elements**    | -                                                                                                                                                                            | -                                                                                                             | -                      | **TBD**     |
| High     | 1.1 Update Theme                   | Replace the existing color objects in `theme.ts` with the new approved light and dark mode palettes to establish the new design foundation.                                    | `src/styles/theme.ts`                                                                                         | -                      | Not Started |
| High     | 1.2 Create Icon Component          | Create a new reusable `Icon` component wrapping `react-native-vector-icons/Feather`. It must be theme-aware and accept `name`, `size`, `color`, and `style` props.               | `src/components/Icon/index.tsx`                                                                               | -                      | Not Started |
| High     | 1.3 Update Theme Types             | Add a `ThemeColor` type to `types.ts` to support typed color properties in the new `Icon` component, ensuring type safety.                                                   | `src/types/theme.ts`                                                                                          | Task 1.1               | Not Started |
| **Medium** | **Update Camera Scene Components** | -                                                                                                                                                                            | -                                                                                                             | -                      | **TBD**     |
| Medium   | 2.1 Refactor `CameraActions`       | Replace emoji `Text` components with the new `Icon` component (`image`, `refresh-cw`). Update styles to use the new theme and design a new circular capture button.           | `src/components/CameraActions/index.tsx`<br>`src/components/CameraActions/styles.ts`                           | Task 1.2               | Not Started |
| Medium   | 2.2 Refactor `CameraOptions`       | Replace all emoji `Text` components with `Icon` components (`refresh-ccw`, `zap`/`zap-off`, `video`, `music`, `moon`). Align styles with the new theme.                         | `src/components/CameraOptions/index.tsx`<br>`src/components/CameraOptions/styles.ts`                           | Task 1.2               | Not Started |
| Medium   | 2.3 Refactor `ReturnButton`        | Replace the text-based `<` icon with the `Icon` component (`arrow-left`). Update styles for consistency with the new design system.                                            | `src/components/ReturnButton/index.tsx`<br>`src/components/ReturnButton/styles.ts`                             | Task 1.2               | Not Started |
| Medium   | 2.4 Refactor `PhotoPreview`        | Add `Icon` components next to the text for each action button (`download`, `send`, `trash-2`). Rename "Share" to "Send". Update styles to accommodate icons and the new theme. | `src/components/PhotoPreview/index.tsx`<br>`src/components/PhotoPreview/styles.ts`                             | Task 1.2               | Not Started |

## 4. Navigation UI Overhaul

This section details the plan to modernize the app's main navigation, including the bottom tab bar and screen headers, to create a more intuitive and visually appealing user experience.

### Tab Bar Icon Replacement Map

| Tab Name    | Original Emoji | New Feather Icon   | Notes                                    |
| :---------- | :------------- | :----------------- | :--------------------------------------- |
| `Insights`  | 🗺️ / 📍        | `trending-up`      | Placeholder, see `NOTES.md`.             |
| `ChatStack` | 💬 / 💭        | `message-square`   |                                          |
| `Camera`    | 📸 / 📷        | `camera`           |                                          |
| `Stories`   | 👥 / 👤        | `users`            |                                          |
| `Spotlight` | ▶️ / ⏯️        | `play-circle`      |                                          |

### Task Breakdown

| Priority | Task                                  | Implementation Details                                                                                                                                                           | Code Pointers                                                                                                       | Dependencies | Status      |
| :------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :----------- | :---------- |
| **High** | **Refactor Core Navigation**          | -                                                                                                                                                                                | -                                                                                                                   | -            | **TBD**     |
| High     | 3.1 Rename MapScreen to InsightsScreen| Rename the `MapScreen` file and all its references to `InsightsScreen` to align with the new AI-focused feature direction.                                                         | `src/screens/MapScreen/` -> `src/screens/InsightsScreen/`<br>`src/navigation/UserStack.tsx`                         | -            | Not Started |
| High     | 3.2 Refactor `UserStack`              | Replace emoji icons in the tab bar with the new `Icon` component. Update tab bar styling to use the new theme colors. Rename the 'Map' route to 'Insights'.                          | `src/navigation/UserStack.tsx`                                                                                      | Task 1.2     | Not Started |
| Medium   | 3.3 Create `AppHeader` Component      | Create a reusable `AppHeader` component. It should display the screen title and an options button on the right (e.g., a `log-out` icon).                                           | `src/components/AppHeader/index.tsx`<br>`src/components/AppHeader/styles.ts`                                       | Task 1.2     | Not Started |
| Medium   | 3.4 Integrate `AppHeader`             | Replace the default header in `UserStack` with the new `AppHeader` component, passing the appropriate title for each screen and configuring the `log-out` functionality.             | `src/navigation/UserStack.tsx`                                                                                      | Task 3.3     | Not Started |

## 5. Authentication Screens UI Overhaul

This section covers necessary UI additions to the authentication flow to meet functional and compliance requirements.

### Task Breakdown

| Priority | Task                            | Implementation Details                                                                                                                                                                 | Code Pointers                                                                       | Dependencies | Status      |
| :------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :----------- | :---------- |
| **High** | **Update Sign-Up Screen**       | -                                                                                                                                                                                      | -                                                                                   | -            | **TBD**     |
| High     | 4.1 Add 18+ Confirmation Checkbox | Add a mandatory checkbox to the `SignUpScreen`. This is a compliance requirement because the app involves financial investment content. Use `square` / `check-square` for the states. | `src/screens/SignUpScreen/index.tsx`<br>`src/screens/SignUpScreen/styles.ts`         | Task 1.2     | Not Started |
