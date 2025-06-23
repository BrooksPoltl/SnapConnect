import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: theme.spacing.lg,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 200,
      paddingHorizontal: theme.spacing.md,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.circle,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    captureButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    icon: {
      fontSize: theme.fontSizes.lg,
    },
    captureIcon: {
      fontSize: 70,
    },
  });
