/**
 * AIHomeScreen Styles
 * Styles for the AI conversations list screen
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    newChatButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    listContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    conversationItem: {
      marginVertical: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    conversationContent: {
      flex: 1,
      marginRight: 12,
    },
    conversationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    conversationMeta: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    previewContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    previewLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    previewText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    sourcesContainer: {
      marginTop: 12,
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
