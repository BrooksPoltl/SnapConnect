# Task: Implement `StoriesScreen` UI

**Status**: Planning

## 1. Objective

To implement the main UI for the `StoriesScreen`, which will fetch and display a horizontal "stories bar" of friends' and public stories. This screen will serve as the central hub for users to discover and view stories.

## 2. Technical Approach

The screen will use a `useEffect` hook to fetch the stories feed via the `getStoriesFeed` service function when the component mounts. The fetched data will be stored in component state. A horizontal `FlatList` will be used to render the list of user avatars, making it efficient and scrollable. Each item in the list will be pressable, navigating the user to the `StoryViewerScreen`.

## 3. Implementation Steps

### Step 1: State Management

In `src/screens/StoriesScreen/index.tsx`, set up state to hold the feed data and loading/error statuses.

```typescript
import { useState, useEffect } from 'react';
import { StoryFeedItem } from '../../types';
import { getStoriesFeed } from '../../services';
// ... other imports

const [feed, setFeed] = useState<StoryFeedItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 2: Data Fetching

Use a `useEffect` hook to call the `getStoriesFeed` service function. To ensure data is fresh, consider re-fetching when the screen is focused using the `useFocusEffect` hook from React Navigation.

```typescript
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// ... inside the component

useFocusEffect(
  useCallback(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStoriesFeed();
        setFeed(data);
      } catch (e) {
        setError('Failed to load stories. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [])
);
```

### Step 3: Render the UI

-   Display a loading indicator (`ActivityIndicator`) while `isLoading` is true.
-   Display an error message if `error` is not null.
-   Use a `FlatList` component to render the stories bar.
    -   Set the `horizontal` prop to `true`.
    -   Set `showsHorizontalScrollIndicator` to `false`.
    -   The `data` prop will be the `feed` state.
    -   The `renderItem` prop will return a custom component for the story avatar.

### Step 4: Create Story Avatar Component

Create a small, pressable component for each item in the `FlatList`.

-   It should display the user's avatar (a placeholder for now) and their `username`.
-   Wrap it in a `Pressable` to handle navigation.
-   The `onPress` handler will call `navigation.navigate('StoryViewer', { userStories: item.stories })`.
-   Consider adding a visual indicator (e.g., a colored ring around the avatar) if the user has active stories.

### Code Snippet Example

```tsx
// src/screens/StoriesScreen/index.tsx (Conceptual)

// ... imports

const renderStoryItem = ({ item }: { item: StoryFeedItem }) => (
  <Pressable 
    style={styles.storyItem}
    onPress={() => navigation.navigate('StoryViewer', { stories: item.stories, username: item.username })}
  >
    <View style={styles.avatarBorder}>
        {/* Placeholder for an avatar component */}
        <View style={styles.avatar} />
    </View>
    <Text style={styles.username}>{item.username}</Text>
  </Pressable>
);

return (
  <View style={styles.container}>
    {isLoading && <ActivityIndicator />}
    {error && <Text>{error}</Text>}
    {!isLoading && !error && (
      <FlatList
        data={feed}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.author_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesBar}
      />
    )}
    {/* ... rest of the screen content ... */}
  </View>
);
```

## 4. Dependencies

-   `react`: `useState`, `useEffect`, `useCallback`.
-   `react-native`: `FlatList`, `View`, `Text`, `Pressable`, `ActivityIndicator`.
-   `@react-navigation/native`: `useFocusEffect`, `useNavigation`.
-   `src/services/stories.ts`: `getStoriesFeed`.
-   `src/types/stories.ts`: `StoryFeedItem`. 