import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    skeletonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatarSkeleton: {
      marginRight: theme.spacing.sm,
    },
    contentSkeleton: {
      flex: 1,
      justifyContent: 'space-between',
    },
    nameSkeleton: {
      marginBottom: theme.spacing.xs,
    },
    messageSkeleton: {
      // No additional styles needed
    },
    rightSkeleton: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      minHeight: 40,
    },
    timeSkeleton: {
      marginBottom: theme.spacing.xs,
    },
    badgeSkeleton: {
      // No additional styles needed
    },
  });
