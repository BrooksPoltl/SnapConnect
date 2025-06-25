import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: theme.spacing.xl,
      right: theme.spacing.lg,
      zIndex: 1,
    },
    optionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.circle,
      backgroundColor: theme.colors.overlay,
      marginBottom: theme.spacing.md,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });
