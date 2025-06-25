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
    headerSpacer: {
      width: 24,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    resultsContainer: {
      marginTop: 12,
    },
    requestsContainer: {
      gap: 8,
    },
    suggestionsContainer: {
      gap: 8,
    },
    requestItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    userItem: {
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
    userInfo: {
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
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    acceptButton: {
      backgroundColor: theme.colors.success,
    },
    declineButton: {
      backgroundColor: theme.colors.error,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
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
    },
  });
