import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: theme.spacing.sm,
      top: theme.spacing.xxl + theme.spacing.md, // Account for safe area
      width: 40,
      paddingVertical: theme.spacing.sm,
    },
    button: {
      marginTop: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    icon: {
      fontSize: theme.fontSizes.lg,
    },
  });
