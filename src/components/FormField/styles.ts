import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    // Field container (replaces old 'container')
    fieldContainer: {
      marginBottom: theme.spacing.md,
    },
    fieldContainerNoPadding: {
      marginBottom: 0,
    },

    // Labels
    label: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      letterSpacing: 0.5,
    },
    chatLabel: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
    },

    // Input wrapper and base input
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Base container styles (legacy support)
    container: {
      marginBottom: 0,
    },

    // Base input styles
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    // Variant: Chat input
    chatContainer: {
      marginBottom: 0,
    },
    chatInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      maxHeight: 100,
      minHeight: 44,
    },

    // Variant: Inline editing
    inlineContainer: {
      marginBottom: 0,
    },
    inlineInput: {
      flex: 1,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      borderRadius: 0,
      padding: theme.spacing.sm,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: 'transparent',
    },

    // Variant: Search input
    searchContainer: {
      marginBottom: 0,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surfaceHighlight,
    },

    // Size variants
    sizeSmall: {
      fontSize: theme.fontSizes.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: 36,
    },
    sizeMedium: {
      fontSize: theme.fontSizes.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
    },
    sizeLarge: {
      fontSize: theme.fontSizes.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 52,
    },

    // Icon positioning
    leftIconContainer: {
      position: 'absolute',
      left: theme.spacing.sm,
      zIndex: 1,
      paddingRight: theme.spacing.xs,
    },
    rightIconContainer: {
      position: 'absolute',
      right: theme.spacing.sm,
      zIndex: 1,
      paddingLeft: theme.spacing.xs,
    },
    inputWithLeftIcon: {
      paddingLeft: theme.spacing.xl + theme.spacing.sm,
    },
    inputWithRightIcon: {
      paddingRight: theme.spacing.xl + theme.spacing.sm,
    },

    // State variants
    inputError: {
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.surface,
    },
    inputDisabled: {
      opacity: 0.6,
      backgroundColor: theme.colors.disabled,
    },

    // Error text
    errorText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });
