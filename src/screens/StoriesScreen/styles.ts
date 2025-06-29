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
    friendsButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    storiesBar: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    storyItem: {
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    avatarBorder: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.border,
    },
    username: {
      marginTop: theme.spacing.xs,
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textSecondary,
    },
    groupsSection: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    createGroupButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      marginBottom: theme.spacing.md,

      // Enhanced 3D Button Effects - Matching unified styling
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 16,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderTopColor: 'rgba(255, 255, 255, 0.4)',
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    },
    createGroupButtonText: {
      color: theme.colors.white,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      marginLeft: theme.spacing.xs,

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    groupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    groupAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    groupAvatarText: {
      color: theme.colors.white,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.medium,
      color: theme.colors.text,
    },
    groupLastMessage: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    loadingIndicator: {
      marginVertical: 20,
    },
  });
