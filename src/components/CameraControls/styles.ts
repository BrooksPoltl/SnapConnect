import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 10,
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
      marginBottom: 10,
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.white,
      transform: [{ scale: 1 }],
    },
    recordingButton: {
      backgroundColor: theme.colors.error,
      transform: [{ scale: 0.6 }],
    },
    sideButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureSection: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    modeToggle: {
      flexDirection: 'row',
      gap: 12,
    },
    modeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.overlay,
      borderWidth: 1,
      borderColor: `${theme.colors.white}40`,
    },
    activeModeButton: {
      backgroundColor: `${theme.colors.white}20`,
      borderColor: theme.colors.white,
    },
    modeButtonText: {
      color: `${theme.colors.white}80`,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    activeModeButtonText: {
      color: theme.colors.white,
    },
    disabledButton: {
      opacity: 0.3,
    },
  });
