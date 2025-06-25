import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 1,
    },
    closeButton: {
      padding: 10,
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    camera: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    messageText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    permissionButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    permissionButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
    },
    preview: {
      flex: 1,
      width: '100%',
      resizeMode: 'cover',
    },
    photoActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    actionButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
    },
    saveButton: {
      backgroundColor: theme.colors.success,
    },
    shareButton: {
      backgroundColor: theme.colors.primary,
    },
    discardButton: {
      backgroundColor: theme.colors.error,
    },
    // Video recording styles
    recordingIndicator: {
      position: 'absolute',
      top: theme.spacing.xl,
      left: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.overlay,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.pill,
    },
    recordingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.error,
      marginRight: theme.spacing.sm,
    },
    recordingText: {
      color: theme.colors.white,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.semibold,
    },

    topControlsContainer: {
      position: 'absolute',
      top: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignItems: 'center',
    },

    backButton: {
      padding: 10,
    },
    friendsButton: {
      padding: 10,
    },
    bottomControlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.overlay,
    },

    // --- Unified Capture Control Styles ---
    actionsContainer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around', // Use space-around for better distribution
      paddingHorizontal: 20,
    },

    sideButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },

    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.transparent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 6,
      borderColor: theme.colors.white,
    },

    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.white,
      transform: [{ scale: 1 }],
    },

    recordingButton: {
      backgroundColor: theme.colors.error, // A vibrant red for recording
      transform: [{ scale: 0.6 }], // Shrinks to indicate recording
    },

    disabledButton: {
      opacity: 0.3,
    },
  });
