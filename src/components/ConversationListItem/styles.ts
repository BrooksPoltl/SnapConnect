/**
 * ConversationListItem Component Styles
 * Styles for the conversation list item with avatar, content, and status
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.white,
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    lastMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statusContainer: {
      alignItems: 'center',
      minWidth: 80,
    },
    statusIcon: {
      marginBottom: 4,
    },
    statusIconOutline: {
      opacity: 0.6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
  }); 