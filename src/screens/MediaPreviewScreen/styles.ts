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
      backgroundColor: theme.colors.border,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
    },
    buttonIcon: {
      // No styles needed here anymore, the icon is self-contained
    },
    saveButton: {
      // All buttons now use the same neutral styling
    },
    sendButton: {
      // All buttons now use the same neutral styling
    },
    discardButton: {
      // All buttons now use the same neutral styling
    },
    loader: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.overlay,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
    },
    modalTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    modalButtonText: {
      color: theme.colors.surface,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.bold,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      shadowRadius: 4,
      elevation: 5,
    },
    privacyOption: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    privacyOptionText: {
      fontSize: theme.fontSizes.lg,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
