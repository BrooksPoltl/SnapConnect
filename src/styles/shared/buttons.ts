import { StyleSheet } from 'react-native';

import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../theme';

export const buttonStyles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.dark.primary,
    shadowColor: colors.dark.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryGradient: {
    backgroundColor: colors.dark.gradientStart,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  secondary: {
    backgroundColor: colors.dark.surface,
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.primary,
  },
  success: {
    backgroundColor: colors.dark.success,
    shadowColor: colors.dark.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  warning: {
    backgroundColor: colors.dark.warning,
    shadowColor: colors.dark.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  error: {
    backgroundColor: colors.dark.error,
    shadowColor: colors.dark.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.dark.white,
  },
  secondaryText: {
    color: colors.dark.text,
  },
  ghostText: {
    color: colors.dark.primary,
  },
  successText: {
    color: colors.dark.white,
  },
  warningText: {
    color: colors.dark.black,
  },
  errorText: {
    color: colors.dark.white,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 60,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
    borderRadius: borderRadius.md,
  },
  icon: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
    width: 48,
    borderRadius: borderRadius.circle,
  },
  // Enhanced button styles for specific use cases
  floating: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  pill: {
    borderRadius: borderRadius.pill,
  },
  rounded: {
    borderRadius: borderRadius.lg,
  },
});

// Additional button variants for specific use cases
export const enhancedButtonStyles = StyleSheet.create({
  glassmorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  neon: {
    backgroundColor: colors.dark.surface,
    borderWidth: 2,
    borderColor: colors.dark.primary,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    backgroundColor: colors.dark.primary,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
