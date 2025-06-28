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

    // Input wrapper and base input with 3D container effect
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },

    // Inner glossy overlay for 3D effect (positioned above input)
    inputGloss: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
      pointerEvents: 'none',
      zIndex: 1,
    },

    // Inner shadow effect at bottom
    inputShadow: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '20%',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderBottomLeftRadius: theme.borderRadius.md,
      borderBottomRightRadius: theme.borderRadius.md,
      pointerEvents: 'none',
      zIndex: 1,
    },

    // Base container styles (legacy support)
    container: {
      marginBottom: 0,
    },

    // Base input styles with 3D glossy effect
    input: {
      flex: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,

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

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },

    // Variant: Chat input
    chatContainer: {
      marginBottom: 0,
    },
    chatInput: {
      flex: 1,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      maxHeight: 100,
      minHeight: 44,

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

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
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
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.surfaceHighlight,

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

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
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
      borderTopColor: 'rgba(244, 67, 54, 0.4)',
      borderBottomColor: 'rgba(244, 67, 54, 0.8)',
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.error,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 12,
    },
    inputDisabled: {
      opacity: 0.6,
      backgroundColor: theme.colors.disabled,
      shadowOpacity: 0.1,
      elevation: 5,
    },

    // Error text
    errorText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });
