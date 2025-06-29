/**
 * AIChatScreen Styles
 * Styles for the AI chat interface
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardAvoid: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    titleButton: {
      flex: 1,
      paddingVertical: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    titleInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,

      // Enhanced 3D Border System
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderTopColor: 'rgba(30, 136, 229, 0.6)',
      borderBottomColor: 'rgba(30, 136, 229, 0.8)',

      // Dramatic 3D Shadow
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 12,

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    messagesList: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    messageContainer: {
      marginVertical: 4,
      maxWidth: '80%',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
    },
    aiMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 20,
    },
    userMessageText: {
      color: theme.colors.white,
    },
    aiMessageText: {
      color: theme.colors.text,
    },
    shareButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      fontSize: 16,
      color: theme.colors.text,

      // Enhanced 3D Border System
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderTopWidth: 2,
      borderTopColor: 'rgba(255, 255, 255, 0.25)',
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0, 0, 0, 0.3)',

      // Dramatic 3D Shadow
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 15,

      // Text shadow for depth
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      marginBottom: 2,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.surface,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    modalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginLeft: 12,
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      marginTop: 8,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    formFieldContainer: {
      flex: 1,
    },
    formFieldNoMargin: {
      flex: 1,
      marginBottom: 0,
    },
  });
