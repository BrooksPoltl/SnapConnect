# Task: Update Navigation

**Status**: Implemented

## 1. Objective

To integrate the new `StoryViewerScreen` into the application's navigation
stack, making it accessible from the `StoriesScreen`.

## 2. Technical Approach

This involves two main steps:

1.  **Updating Type Definitions**: The `UserStackParamList` in our navigation
    types must be updated to include a definition for the `StoryViewer` route
    and its expected parameters.
2.  **Modifying the Navigator**: The `StoryViewerScreen` component will be added
    as a `Stack.Screen` to the `UserStack` navigator defined in
    `src/navigation/UserStack.tsx`.

## 3. Implementation Steps

### Step 1: Update Navigation Types

In `src/types/navigation.ts`, add the `StoryViewer` screen to the
`UserStackParamList`. The params will include the array of stories for a user
and their username, which will be displayed in the viewer's header.

```typescript
// src/types/navigation.ts
import { Story } from './stories'; // Import the new Story type

export type UserStackParamList = {
  // ... other existing screen definitions
  Stories: undefined;
  StoryViewer: {
    stories: Story[];
    username: string;
  };
};

// ... other param lists
```

### Step 2: Add Screen to the Navigator

In `src/navigation/UserStack.tsx`, import the `StoryViewerScreen` and add it to
the `UserStack.Navigator`. It's often best to define screens that behave like
modals with `presentation: 'modal'` to get the appropriate transition animation,
but a standard presentation is also acceptable.

```tsx
// src/navigation/UserStack.tsx

import { createStackNavigator } from '@react-navigation/stack';
import { UserStackParamList } from '../types';

// ... import other screens
import { StoryViewerScreen } from '../screens/StoryViewerScreen';

const UserStack = createStackNavigator<UserStackParamList>();

export function UserStack() {
  return (
    <UserStack.Navigator
      // It is recommended to hide the header for custom modal-like screens
      screenOptions={{ headerShown: false }}
    >
      {/* ... other screens in the stack ... */}
      <UserStack.Screen name='Stories' component={StoriesScreen} />
      <UserStack.Screen
        name='StoryViewer'
        component={StoryViewerScreen}
        options={{
          // This provides a modal-style presentation
          presentation: 'modal',
        }}
      />
    </UserStack.Navigator>
  );
}
```

## 4. Usage Example

With the navigation set up, the `onPress` handler in `StoriesScreen` will now
work as intended.

```tsx
// src/screens/StoriesScreen/index.tsx

const navigation = useNavigation();
// ...

const handlePress = (item: StoryFeedItem) => {
  navigation.navigate('StoryViewer', {
    stories: item.stories,
    username: item.username,
  });
};
```

## 5. Dependencies

- `@react-navigation/stack`: `createStackNavigator`.
- `@react-navigation/native`: `useNavigation`.
- `src/types/navigation.ts`: The `UserStackParamList` type definition.
- `src/screens/StoryViewerScreen/index.tsx`: The screen component to be
  registered.
