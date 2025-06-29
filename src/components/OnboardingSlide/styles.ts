/**
 * OnboardingSlide Styles
 *
 * Styling for the onboarding slide component with consistent
 * spacing, typography, and layout for the tutorial flow.
 */
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.dark.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  description: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },

  snapshotContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    transform: [{ scale: 0.8 }],
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
});
