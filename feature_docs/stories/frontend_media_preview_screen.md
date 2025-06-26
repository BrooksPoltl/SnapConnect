# Task: Update `MediaPreviewScreen`

**Status**: Implemented

## 1. Objective

To modify the `MediaPreviewScreen` to include an "Add to Story" button and a
subsequent modal for selecting privacy. This will be the primary entry point for
users to post their captured photos and videos as stories.

## 2. Technical Approach

The screen will be updated to include a new button in its UI. State will be
managed using `useState` to control the visibility of a `Modal` component, which
will present the privacy options. The `postStory` function from the `stories`
service will be called upon selection, and user feedback (e.g., loading
indicators, navigation) will be handled appropriately.

## 3. Implementation Steps

### Step 1: Add "Add to Story" Button

In `src/screens/MediaPreviewScreen/index.tsx`, add a new `Pressable` component
styled as a button with the text "Add to Story". This will be placed alongside
the existing "Send" button.

### Step 2: Implement Privacy Selection Modal

- Add a `useState` hook to manage the modal's visibility:
  ```typescript
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  ```
- Add a `Modal` component from `react-native` to the JSX. Its `visible` prop
  will be tied to `isPrivacyModalVisible`.
- Inside the modal, add two buttons: "Public" and "Private (Friends Only)".
- Add a "Cancel" button or allow dismissing the modal by tapping outside.
- Pressing the "Add to Story" button will set `isPrivacyModalVisible(true)`.

### Step 3: Implement Story Posting Logic

- Create a new state to handle loading status:
  ```typescript
  const [isPosting, setIsPosting] = useState(false);
  ```
- Create an async function, `handlePostStory(privacy)`, that will be called when
  a privacy option is selected.
- This function will:
  1.  Set `isPosting(true)`.
  2.  Dismiss the modal: `setPrivacyModalVisible(false)`.
  3.  Call the `postStory` service function, passing the `media.uri`,
      `media.type`, selected `privacy`, and the current user's ID.
  4.  Wrap the call in a `try...catch` block to handle potential errors from the
      service and display an alert to the user.
  5.  In the `finally` block, set `isPosting(false)`.
  6.  On success, navigate the user away from the preview screen, likely back to
      the camera or to the main stories screen. Use `navigation.navigate(...)`.

### Step 4: Add Loading Indicator

Use the `isPosting` state to show a loading indicator (e.g.,
`ActivityIndicator`) to give the user feedback while the media is uploading and
the story is being created. You can overlay this on the screen or disable the
buttons to prevent duplicate submissions.

### Code Snippet Example

```tsx
// src/screens/MediaPreviewScreen/index.tsx (Conceptual)

// ... imports, including useState, Modal, Alert, etc.
// ... existing hooks for navigation, route, and auth

const { media } = route.params; // { uri, type: 'photo' | 'video' }
const { user } = useAuthentication(); // Assume this hook provides the user object

const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
const [isPosting, setIsPosting] = useState(false);

const handlePostStory = async (privacy: 'public' | 'private_friends') => {
  if (!user) return;

  setPrivacyModalVisible(false);
  setIsPosting(true);

  try {
    await postStory(media.uri, media.type, privacy, user.id);
    // On success, navigate somewhere, e.g., back to the main stack
    navigation.popToTop();
  } catch (error) {
    Alert.alert('Error', 'Failed to post story. Please try again.');
  } finally {
    setIsPosting(false);
  }
};

return (
  <View>
    {/* ... existing media preview (Image or Video) ... */}

    {isPosting && <ActivityIndicator size='large' />}

    <View style={styles.actionsContainer}>
      {/* ... existing Send, Save buttons ... */}
      <Button
        title='Add to Story'
        onPress={() => setPrivacyModalVisible(true)}
        disabled={isPosting}
      />
    </View>

    <Modal
      transparent={true}
      visible={isPrivacyModalVisible}
      onRequestClose={() => setPrivacyModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Who can see your story?</Text>
          <Button title='Public' onPress={() => handlePostStory('public')} />
          <Button
            title='Friends Only'
            onPress={() => handlePostStory('private_friends')}
          />
          <Button
            title='Cancel'
            onPress={() => setPrivacyModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  </View>
);
```

## 4. Dependencies

- `react-native`: `Modal`, `Button`, `ActivityIndicator`, `Alert`.
- `src/services/stories.ts`: The `postStory` function.
- `useAuthentication` hook (or equivalent) to get the current user's ID.
- `@react-navigation/native` hooks (`useNavigation`, `useRoute`).
