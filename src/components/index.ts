/**
 * This file serves as a barrel for all components, making them easily importable from a single location.
 *
 * Each component should be exported from its own file and then re-exported here.
 * This pattern helps to keep imports clean and consistent across the application.
 */

// Enhanced Animated Components
export { default as AnimatedPressable } from './AnimatedPressable';
export { default as AnimatedCard } from './AnimatedCard';
export { default as PulseAnimation } from './PulseAnimation';
export { default as FadeInAnimation } from './FadeInAnimation';

// Core Components
export { default as AuthButton } from './AuthButton';
export { Avatar } from './Avatar';
// export { default as Camera } from './Camera';
// export { default as CameraActions } from './CameraActions';
export { default as CameraControls } from './CameraControls';
export { default as CameraOptions } from './CameraOptions';
export { default as CameraPermissionStatus } from './CameraPermissionStatus';
export { default as ConversationListItem } from './ConversationListItem';
export { default as DisclaimerText } from './DisclaimerText';
export { default as FormField } from './FormField';
export { FriendListItem } from './FriendListItem';
export { default as HomeScreenAnimatedText } from './HomeScreenAnimatedText';
export { default as Icon } from './Icon';
export { default as PhotoPreview } from './PhotoPreview';
export { default as ReturnButton } from './ReturnButton';
export { SelectedUserCard } from './SelectedUserCard';
export { default as DrawingCanvas } from './DrawingCanvas';
export { default as DrawingToolbar } from './DrawingToolbar';
