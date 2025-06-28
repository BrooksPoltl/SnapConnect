/**
 * ConversationCard Styles
 * Styles for the unified conversation card component
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginVertical: 8,
      marginHorizontal: 4,
      // Enhanced 3D Background with gradient simulation
      backgroundColor: theme.colors.surface,
      borderRadius: 18,

      // Multiple border layers for glass effect
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderTopWidth: 2,
      borderTopColor: 'rgba(255, 255, 255, 0.25)',
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0, 0, 0, 0.3)',

      // Dramatic 3D Shadow System
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 20,

      // Additional depth shadow
      position: 'relative',
      overflow: 'hidden',
    },
    // Inner glossy overlay for enhanced 3D effect
    innerGloss: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '60%',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      pointerEvents: 'none',
    },
    // Inner shadow effect at bottom
    innerShadow: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '25%',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      pointerEvents: 'none',
    },
    // Content wrapper to ensure it's above overlay
    contentWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      zIndex: 1,
    },
    leftIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      // 3D Icon Container Effects
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 6,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderTopColor: 'rgba(255, 255, 255, 0.4)',
      borderTopWidth: 1,
    },
    content: {
      flex: 1,
      marginRight: 14,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    unreadBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
      // 3D Badge Effects
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderTopColor: 'rgba(255, 255, 255, 0.6)',
      borderTopWidth: 0.5,
    },
    unreadText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.white,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
  });
