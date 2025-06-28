import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.sm,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.md,
    },
    storyItem: {
      alignItems: 'center',
      marginRight: theme.spacing.md,
      width: 70,
    },
    storyRing: {
      width: 66,
      height: 66,
      borderRadius: 33,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    avatarSkeleton: {
      // No additional styles needed
    },
    usernameSkeleton: {
      alignSelf: 'center',
    },
  });
