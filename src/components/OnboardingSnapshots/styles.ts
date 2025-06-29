/**
 * OnboardingSnapshots Styles
 *
 * Styling for the onboarding snapshot components that demonstrate
 * app features in scaled-down previews.
 */
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../styles/theme';

export const styles = StyleSheet.create({
  // Welcome Snapshot Styles
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  missionContainer: {
    paddingHorizontal: spacing.sm,
  },
  missionText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // AI Insights Snapshot Styles
  aiContainer: {
    padding: spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.dark.text,
    marginLeft: spacing.sm,
  },
  chatBubbleUser: {
    backgroundColor: colors.dark.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  chatBubbleAI: {
    backgroundColor: colors.dark.surfaceHighlight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  chatText: {
    fontSize: fontSizes.sm,
    color: colors.dark.text,
    lineHeight: 16,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  sourceLinkText: {
    fontSize: fontSizes.xs,
    color: colors.dark.accent,
    marginLeft: spacing.xs,
    fontWeight: fontWeights.medium,
  },

  // Sharing Snapshot Styles
  sharingContainer: {
    padding: spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.dark.white,
  },
  postInfo: {
    flex: 1,
  },
  username: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.dark.text,
  },
  timestamp: {
    fontSize: fontSizes.xs,
    color: colors.dark.textSecondary,
  },
  postContent: {
    fontSize: fontSizes.sm,
    color: colors.dark.text,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surfaceHighlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.dark.success,
  },
  verificationText: {
    fontSize: fontSizes.xs,
    color: colors.dark.success,
    marginLeft: spacing.xs,
    fontWeight: fontWeights.medium,
  },

  // Networking Snapshot Styles
  networkingContainer: {
    padding: spacing.sm,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  groupCard: {
    backgroundColor: colors.dark.surfaceHighlight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  groupAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatarText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.dark.white,
  },
  groupName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.dark.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  groupMembers: {
    fontSize: fontSizes.xs,
    color: colors.dark.textSecondary,
  },

  // Stories Snapshot Styles
  storiesContainer: {
    padding: spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
  },
  storyPreview: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  storyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.dark.primary,
    marginBottom: spacing.xs,
  },
  storyAvatarViewed: {
    borderColor: colors.dark.disabled,
  },
  storyAvatarText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.dark.white,
  },
  storyUsername: {
    fontSize: fontSizes.xs,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  storyIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark.primary,
    marginTop: spacing.xs,
  },
  storyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  storyContentText: {
    fontSize: fontSizes.xs,
    color: colors.dark.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
