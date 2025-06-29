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
      textAlign: 'center',
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
      gap: 8,

      // Enhanced 3D Border System
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderTopWidth: 2,
      borderTopColor: 'rgba(255, 255, 255, 0.25)',
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0, 0, 0, 0.3)',

      // Dramatic 3D Shadow
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 15,
    },
    activeTabButton: {
      backgroundColor: '#007AFF', // Blue background like other active buttons
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderTopColor: 'rgba(255, 255, 255, 0.4)',
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
      shadowColor: '#007AFF', // Blue shadow
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 20,
    },
    tabButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    activeTabButtonText: {
      color: '#FFFFFF', // White text on blue background
      fontWeight: '600',

      // Enhanced text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
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
