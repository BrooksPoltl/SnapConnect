import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    disclaimerText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.fontSizes.sm * 1.4,
      marginVertical: theme.spacing.md,
    },
    linkContainer: {
      // No specific styles needed, just for touch handling
    },
    linkText: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
  });
