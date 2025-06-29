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
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      width: '100%',
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.regular,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    formField: {
      marginBottom: theme.spacing.md,
      width: '100%',
      maxWidth: 400,
    },
    buttonSpacing: {
      marginTop: theme.spacing.lg,
      width: '100%',
      maxWidth: 400,
    },
  });
