import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.borderRadius.pill,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    // Primary variant styles
    buttonPrimary: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    // Secondary variant styles
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    // Ghost variant styles
    buttonGhost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    // Success variant styles
    buttonSuccess: {
      backgroundColor: theme.colors.success,
      shadowColor: theme.colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    // Warning variant styles
    buttonWarning: {
      backgroundColor: theme.colors.warning,
      shadowColor: theme.colors.warning,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    // Error variant styles
    buttonError: {
      backgroundColor: theme.colors.error,
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    // Size variants
    buttonSmall: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 40,
    },
    buttonLarge: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 60,
    },
    // Disabled state
    buttonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    // Text styles
    buttonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      textAlign: 'center',
    },
    buttonTextPrimary: {
      color: theme.colors.white,
    },
    buttonTextSecondary: {
      color: theme.colors.text,
    },
    buttonTextGhost: {
      color: theme.colors.primary,
    },
    buttonTextSuccess: {
      color: theme.colors.white,
    },
    buttonTextWarning: {
      color: theme.colors.black,
    },
    buttonTextError: {
      color: theme.colors.white,
    },
    // Text size variants
    buttonTextSmall: {
      fontSize: theme.fontSizes.sm,
    },
    buttonTextLarge: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
    },
  });
