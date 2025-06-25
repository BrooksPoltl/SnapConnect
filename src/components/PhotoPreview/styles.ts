import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    preview: {
      flex: 1,
      width: '100%',
      resizeMode: 'cover',
    },
    photoActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      minWidth: 80,
      justifyContent: 'center',
      backgroundColor: theme.colors.border,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
    },
    actionButtonText: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
    },
    buttonIcon: {
      marginRight: theme.spacing.xs,
    },
    saveButton: {
      // All buttons now use the same neutral styling
    },
    sendButton: {
      // All buttons now use the same neutral styling
    },
    discardButton: {
      // All buttons now use the same neutral styling
    },
  });
