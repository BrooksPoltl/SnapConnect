import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    content: {
      flex: 1,
    },
    friendsList: {
      padding: 16,
    },
    friendsCount: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    friendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    friendInfo: {
      flex: 1,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    score: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    removeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
      paddingHorizontal: 32,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
      marginBottom: 24,
    },
    addFriendsButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    addFriendsButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.white,
    },
  });
