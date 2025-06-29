/**
 * CollapsibleText Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../styles/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    textContainer: {
      position: 'relative',
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
      color: theme.colors.text,
    },
    toggleButton: {
      alignSelf: 'flex-start',
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    toggleButtonText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
