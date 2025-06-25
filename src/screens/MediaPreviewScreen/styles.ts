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
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
      justifyContent: 'center',
    },
    actionButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.background,
    },
    buttonIcon: {
      marginRight: theme.spacing.xs,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
    },
    discardButton: {
      backgroundColor: theme.colors.error,
    },
  });
