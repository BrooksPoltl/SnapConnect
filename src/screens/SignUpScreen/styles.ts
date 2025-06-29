import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxl + theme.spacing.lg, // Account for return button
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      letterSpacing: 1,
    },
    missionContainer: {
      width: '100%',
      maxWidth: 300,
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
    },
    missionTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    missionText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    form: {
      width: '100%',
      maxWidth: 300,
      marginBottom: theme.spacing.xl,
    },
    inputLabel: {
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    input: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    disclaimerText: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 16,
      marginTop: theme.spacing.lg,
    },
    linkText: {
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.medium,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.pill,
      width: '100%',
      maxWidth: 300,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      marginBottom: theme.spacing.lg,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.border,
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.background,
    },
  });
