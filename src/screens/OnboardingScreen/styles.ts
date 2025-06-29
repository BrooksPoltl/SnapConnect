/**
 * OnboardingScreen Styles
 *
 * Comprehensive styling for the onboarding flow including:
 * - Layout and navigation controls
 * - Progress indicators
 * - Button styles
 * - Responsive design elements
 */
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  skipButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  skipText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.dark.textSecondary,
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark.disabled,
  },

  progressDotActive: {
    backgroundColor: colors.dark.primary,
    width: 24,
  },

  scrollView: {
    flex: 1,
  },

  slideContainer: {
    flex: 1,
  },

  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },

  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  backButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.dark.textSecondary,
  },

  spacer: {
    flex: 1,
  },

  nextButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.pill,
    minWidth: 120,
    alignItems: 'center',
    // 3D button styling
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
  },

  nextButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.dark.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  placeholderSnapshot: {
    width: 200,
    height: 300,
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
  },

  placeholderText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.dark.textSecondary,
  },
});
