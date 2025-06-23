import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    messageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    messageText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: theme.fontSizes.lg * 1.4,
    },
  });
