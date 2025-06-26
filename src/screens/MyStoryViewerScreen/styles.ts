import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
    },
    gestureHandler: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 10,
      right: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    username: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 5,
    },
    media: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    tapContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      zIndex: 0,
    },
    tapArea: {
      flex: 1,
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
      backgroundColor: 'rgba(0,0,0,0.5)',
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
