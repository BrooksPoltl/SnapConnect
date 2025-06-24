import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      color: theme.colors.text,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSizes.lg,
      marginBottom: theme.spacing.lg,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
    },
  });
