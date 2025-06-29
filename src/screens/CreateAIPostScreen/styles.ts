/**
 * Styles for CreateAIPostScreen
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: 60, // Account for status bar
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },

  cancelButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,

    // 3D Button Effects
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: fontSizes.sm,
    fontWeight: '500',

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  headerTitle: {
    color: colors.dark.text,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },

  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,

    // Enhanced 3D Button Effects - Matching Group Details Button
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },

  postButtonDisabled: {
    backgroundColor: colors.dark.disabled,
  },

  postText: {
    color: '#FFFFFF',
    fontSize: fontSizes.sm,
    fontWeight: '600',

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  postTextDisabled: {
    color: colors.dark.textSecondary,
  },

  content: {
    flex: 1,
    padding: spacing.md,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.md,

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  privacyContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  privacyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,

    // Enhanced 3D Border System
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',

    // Dramatic 3D Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },

  privacyOptionSelected: {
    backgroundColor: '#007AFF', // Blue background like Group Details button
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#007AFF', // Blue shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },

  privacyText: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '500',

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  privacyTextSelected: {
    color: '#FFFFFF', // White text on blue background
    fontWeight: '600',

    // Enhanced text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  commentaryInput: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 120,
    color: colors.dark.text,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },

  characterCount: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.xs,
    textAlign: 'right',
    marginTop: spacing.sm,
  },

  aiResponseContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,

    // Enhanced 3D Border System
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',

    // Dramatic 3D Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },

  aiResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  aiResponseLabel: {
    color: colors.dark.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },

  aiResponseText: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    lineHeight: 22,

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },

  sourceText: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.xs,
  },

  previewContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,

    // Enhanced 3D Border System
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',

    // Dramatic 3D Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary,
    marginRight: spacing.sm,

    // 3D Avatar Container Effects
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },

  previewUserInfo: {
    flex: 1,
  },

  previewUsername: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    fontWeight: '600',

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  previewTimestamp: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },

  previewPrivacyBadge: {
    padding: spacing.xs,
  },

  previewCommentary: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  previewAiResponse: {
    backgroundColor: colors.dark.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.dark.primary,
  },

  previewAiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  previewAiLabel: {
    color: colors.dark.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },

  previewAiText: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    lineHeight: 20,

    // Text shadow for depth
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  formFieldContainer: {
    marginBottom: 8,
  },
});
