import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      color: theme.colors.text,
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
      color: theme.colors.text,
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
  });
