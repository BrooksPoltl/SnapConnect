/**
 * SourceCitation Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../styles/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 12,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    companyName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginRight: 8,
    },
    filingDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
