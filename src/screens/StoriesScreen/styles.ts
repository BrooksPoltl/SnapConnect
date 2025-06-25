import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    friendsButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
