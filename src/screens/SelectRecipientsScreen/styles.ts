import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      padding: 20,
      textAlign: 'center',
      color: theme.colors.text,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    avatarText: {
      fontSize: 18,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    friendName: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      margin: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: theme.colors.disabled,
    },
    sendButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
    },
  });
