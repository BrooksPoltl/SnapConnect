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
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconSkeleton: {
      marginRight: theme.spacing.sm,
    },
    contentSkeleton: {
      flex: 1,
      justifyContent: 'space-between',
    },
    titleSkeleton: {
      marginBottom: theme.spacing.xs,
    },
    metaSkeleton: {
      // No additional styles needed
    },
    chevronSkeleton: {
      marginLeft: theme.spacing.sm,
    },
  });
