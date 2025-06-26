/**
 * FeedScreen Styles
 * Styles for the AI posts feed screen with tabs
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeTabButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    tabButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    activeTabButtonText: {
      color: theme.colors.white,
    },
    listContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    postItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    postTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    userCommentary: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    aiResponseContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    aiResponse: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    sourceLink: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingVertical: 8,
    },
    sourceLinkText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginLeft: 6,
      fontWeight: '500',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop: 80,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
