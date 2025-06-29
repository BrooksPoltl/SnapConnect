/**
 * This file serves as a barrel for all components, making them easily importable from a single location.
 *
 * Each component should be exported from its own file and then re-exported here.
 * This pattern helps to keep imports clean and consistent across the application.
 */

// Core Components
export { default as Icon } from './Icon';
export { Avatar } from './Avatar';
export { default as FormField } from './FormField';
export { default as AuthButton } from './AuthButton';

// Animation Components
export { default as AnimatedCard } from './AnimatedCard';
export { default as AnimatedPressable } from './AnimatedPressable';
export { default as FadeInAnimation } from './FadeInAnimation';
export { default as PulseAnimation } from './PulseAnimation';

// Skeleton Components
export { default as SkeletonLoader } from './SkeletonLoader';
export { default as CardSkeleton } from './CardSkeleton';
export { default as ConversationListSkeleton } from './ConversationListSkeleton';
export { default as AIConversationSkeleton } from './AIConversationSkeleton';
export { default as StoryListSkeleton } from './StoryListSkeleton';

// UI Components
export { default as ConversationCard } from './ConversationCard';
export { default as ConversationListItem } from './ConversationListItem';
export { FriendListItem } from './FriendListItem';
export { default as DisclaimerText } from './DisclaimerText';
export { default as ReturnButton } from './ReturnButton';
export { SelectedUserCard } from './SelectedUserCard';
export { default as ScreenHeader } from './ScreenHeader';

// Camera Components
export { default as CameraControls } from './CameraControls';
export { default as CameraOptions } from './CameraOptions';
export { default as CameraPermissionStatus } from './CameraPermissionStatus';
export { default as PhotoPreview } from './PhotoPreview';

// Drawing Components
export { default as DrawingCanvas } from './DrawingCanvas';
export { default as DrawingToolbar } from './DrawingToolbar';

// Text Components
export { default as HomeScreenAnimatedText } from './HomeScreenAnimatedText';

// Onboarding Components
export { OnboardingSlide } from './OnboardingSlide';
export { OnboardingSnapshot } from './OnboardingSnapshots';

// Other Components
export { default as ShimmerView } from './ShimmerView';
export { default as CollapsibleText } from './CollapsibleText';
export { default as SourceList } from './SourceList';
export { default as SourceCitation } from './SourceCitation';
