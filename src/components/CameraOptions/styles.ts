import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: theme.spacing.md,
      zIndex: 1,
      alignItems: 'center',
    },
    optionButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.circle,
      backgroundColor: theme.colors.overlay,
      marginBottom: theme.spacing.lg,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });
