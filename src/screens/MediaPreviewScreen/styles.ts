import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mediaContainer: {
      flex: 1,
      backgroundColor: theme.colors.shadow,
      justifyContent: 'center',
      alignItems: 'center',
    },
    media: {
      width: '100%',
      height: '100%',
    },
    videoContainer: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    muteButton: {
      position: 'absolute',
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.circle,
      minWidth: 80,
      minHeight: 60,
    },
    actionButtonText: {
      marginTop: theme.spacing.xs,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.white,
    },
    discardButton: {
      backgroundColor: theme.colors.error,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
    },
  });
