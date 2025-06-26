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
    padding: spacing.sm,
  },

  cancelText: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '400',
  },

  headerTitle: {
    color: colors.dark.text,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },

  postButton: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },

  postButtonDisabled: {
    backgroundColor: colors.dark.disabled,
  },

  postText: {
    color: colors.dark.surface,
    fontSize: fontSizes.md,
    fontWeight: '600',
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
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
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
    padding: spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.dark.border,
    gap: spacing.sm,
  },

  privacyOptionSelected: {
    borderColor: colors.dark.primary,
    backgroundColor: colors.dark.surface,
  },

  privacyText: {
    color: colors.dark.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '500',
  },

  privacyTextSelected: {
    color: colors.dark.primary,
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
    borderWidth: 1,
    borderColor: colors.dark.border,
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
    borderWidth: 1,
    borderColor: colors.dark.border,
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
  },

  previewUserInfo: {
    flex: 1,
  },

  previewUsername: {
    color: colors.dark.text,
    fontSize: fontSizes.sm,
    fontWeight: '600',
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
  },
});
