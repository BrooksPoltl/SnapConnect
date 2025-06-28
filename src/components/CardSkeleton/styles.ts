import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    cardContainer: {
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    headerSkeleton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    avatarSkeleton: {
      marginRight: theme.spacing.sm,
    },
    headerContent: {
      flex: 1,
    },
    nameSkeleton: {
      marginBottom: theme.spacing.xs,
    },
    timeSkeleton: {
      // No additional styles needed
    },
    imageSkeleton: {
      // No additional styles needed
    },
    textContent: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    textLine: {
      marginBottom: theme.spacing.xs,
    },
    actionsSkeleton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionButton: {
      marginRight: theme.spacing.lg,
    },
  });
