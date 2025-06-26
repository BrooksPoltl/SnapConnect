# Task: Create `StoryViewerScreen`

**Status**: Planning

## 1. Objective

To build a new, simple, full-screen component, `StoryViewerScreen`, that displays story content (a photo or video). This screen will be launched when a user taps on a story from the `StoriesScreen`.

## 2. Technical Approach

The screen will receive an array of a specific user's stories as a navigation parameter. For this initial version, it will only display the first story in the array. It will use a `View` with a dark background to create an immersive experience. An `Image` or `Video` component (`expo-av`) will be used to render the content. A simple "Close" button will allow the user to dismiss the viewer.

## 3. Implementation Steps

### Step 1: Create New Screen Files

Create the following new files:

-   `src/screens/StoryViewerScreen/index.tsx`
-   `src/screens/StoryViewerScreen/styles.ts`

### Step 2: Set Up the Component

In `index.tsx`, set up a basic functional component that retrieves the stories data from the route params.

```typescript
// src/screens/StoryViewerScreen/index.tsx

import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Video } from 'expo-av';
import { UserStackParamList, Story } from '../../types'; // Assuming types are defined
import { styles } from './styles';

type StoryViewerRouteProp = RouteProp<UserStackParamList, 'StoryViewer'>;

export function StoryViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute<StoryViewerRouteProp>();
  
  const { stories, username } = route.params;

  // For V1, we only show the first story.
  // Future versions could add state to cycle through them.
  const currentStory = stories?.[0];

  if (!currentStory) {
    // Handle case where stories might be empty
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Story not available.</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text>Close</Text>
        </Pressable>
      </View>
    );
  }

  // ... render logic from Step 3
}
```

### Step 3: Render Media Content

Conditionally render an `<Image>` or `<Video>` component based on the `media_type` of the `currentStory`.

-   The `source` for the media will be constructed using the `storage_path` from the story object and the public URL from the Supabase client.
-   The `Video` component from `expo-av` should be configured to autoplay, loop, and be muted by default.

```tsx
// Inside the component's return statement

// First, get the public URL for the media from Supabase Storage
const { data: mediaURL } = supabase.storage
  .from('media')
  .getPublicUrl(currentStory.storage_path);

return (
  <View style={styles.container}>
    {/* Header with username and close button */}
    <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
    </View>

    {/* Media Content */}
    {currentStory.media_type === 'image' ? (
      <Image source={{ uri: mediaURL.publicUrl }} style={styles.media} resizeMode="contain" />
    ) : (
      <Video
        source={{ uri: mediaURL.publicUrl }}
        style={styles.media}
        shouldPlay
        isLooping
        isMuted
        resizeMode="contain"
      />
    )}
  </View>
);
```

### Step 4: Add Styles

In `styles.ts`, add styles for the container, media element, header, username, and close button to ensure it looks like a proper full-screen modal.

```typescript
// src/screens/StoryViewerScreen/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for immersion
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // ... other styles
});
```

## 4. Dependencies

-   `react-native`: `View`, `Image`, `Text`, `Pressable`.
-   `@react-navigation/native`: `useNavigation`, `useRoute`.
-   `expo-av`: For the `Video` component.
-   `src/services/supabase.ts`: To get the public URL for media.
-   `src/types`: `UserStackParamList`, `Story`. 