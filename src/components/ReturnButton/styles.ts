import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      position: 'absolute',
      top: theme.spacing.xxl + theme.spacing.sm, // Account for safe area
      zIndex: 10,
    },
    button: {
      alignItems: 'flex-start',
      paddingLeft: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      width: '100%',
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.medium,
    },
  });
