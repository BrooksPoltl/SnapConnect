import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a1a', // Dark background
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    headerSection: {
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },
    fixedHeader: {
      alignItems: 'center',
    },
    middleSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    autoScrollSection: {
      width: '100%',
      minHeight: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomSection: {
      alignItems: 'center',
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: '#1a1a1a',
      borderTopWidth: 1,
      borderTopColor: '#333333',
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    contentIcon: {
      marginRight: theme.spacing.md,
    },
    contentText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.white,
      textAlign: 'left',
    },

    logoContainer: {
      marginBottom: theme.spacing.sm,
    },
    logo: {
      fontSize: 42,
      textAlign: 'center',
    },
    title: {
      fontSize: theme.fontSizes.xxxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    tagline: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: '#cccccc', // Light gray text
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.sm,
      lineHeight: 22,
    },
    featuresSection: {
      paddingVertical: theme.spacing.md,
    },
    featureCard: {
      backgroundColor: '#2a2a2a', // Dark card background
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      elevation: 3,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    featureIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    featureTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.xs,
    },
    featureDescription: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.regular,
      color: '#cccccc', // Light gray text
      lineHeight: 20,
    },
    ctaSection: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },
    ctaText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    ctaSubtext: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: '#cccccc', // Light gray text
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.pill,
      marginBottom: theme.spacing.sm,
      minWidth: 280,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    primaryButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.background,
    },
    secondaryButton: {
      backgroundColor: '#2a2a2a', // Dark button background
      borderWidth: 1.5,
      borderColor: '#444444', // Dark border
    },
    secondaryButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.white,
    },
    buttonIcon: {
      marginLeft: theme.spacing.xs,
    },
    logInText: {
      fontSize: theme.fontSizes.sm,
      color: '#cccccc', // Light gray text
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    logInLink: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
    footer: {
      alignItems: 'center',
      paddingTop: theme.spacing.md,
    },
    footerText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      color: '#cccccc', // Light gray text
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    disclaimer: {
      fontSize: theme.fontSizes.xs,
      color: '#999999', // Muted gray text
      textAlign: 'center',
      opacity: 0.8,
    },
    // Legacy feature styles (keeping for compatibility)
    featureRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    featureItem: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xs,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    featureText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    featureSubtext: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    // Keeping legacy styles for removed elements
    hookline: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    stats: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
  });
