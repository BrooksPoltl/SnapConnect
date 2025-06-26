import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    gestureHandler: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.black,
      justifyContent: 'center',
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 10,
      right: 10,
      zIndex: 1,
      paddingHorizontal: 10,
    },
    progressBarContainer: {
      flexDirection: 'row',
      height: 2,
      width: '100%',
      marginBottom: 10,
    },
    progressBar: {
      flex: 1,
      height: '100%',
      marginHorizontal: 2,
    },
    progressBarActive: {
      backgroundColor: theme.colors.white,
    },
    progressBarInactive: {
      backgroundColor: theme.colors.overlay,
    },
    userInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    username: {
      color: theme.colors.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      color: theme.colors.white,
      fontSize: 24,
      fontWeight: 'bold',
      textShadowColor: theme.colors.shadow,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    media: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    errorText: {
      color: theme.colors.white,
      textAlign: 'center',
    },
    prevNextArea: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '30%',
    },
    prevArea: {
      left: 0,
    },
    nextArea: {
      right: 0,
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.overlay,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    footerText: {
      color: theme.colors.white,
      marginLeft: 8,
      fontWeight: '600',
    },
    bottomSheetContent: {
      paddingHorizontal: 20,
    },
    viewerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    viewerUsername: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    viewerTimestamp: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    emptyListText: {
      textAlign: 'center',
      marginTop: 20,
      color: theme.colors.textSecondary,
    },
  });
