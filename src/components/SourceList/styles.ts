/**
 * SourceList Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../styles/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 8,
    },
    toggleButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    toggleContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    toggleText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
      fontWeight: '500',
    },
    sourcesList: {
      marginTop: 8,
    },
  });
