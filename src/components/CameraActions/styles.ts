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
      justifyContent: 'space-around',
      width: '80%',
      maxWidth: 300,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: 'transparent',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
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
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.background,
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
    },
  });
