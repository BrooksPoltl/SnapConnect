/**
 * ConversationScreen Component Styles
 * Styles for the individual chat conversation interface
 */

import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
    },
    headerSpacer: {
      width: 24,
    },
    messagesContainer: {
      flexGrow: 1,
      padding: theme.spacing.md,
      paddingBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.colors.text,
      marginHorizontal: 10,
      overflow: 'hidden',

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
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mediaButton: {
      padding: 5,
    },
    sentMessageContainer: {
      alignSelf: 'flex-end',
      marginVertical: 5,
    },
    receivedMessageContainer: {
      alignSelf: 'flex-start',
      marginVertical: 5,
    },
    sentMessageText: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      padding: 10,
      borderRadius: 15,
      overflow: 'hidden',
    },
    receivedMessageText: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      padding: 10,
      borderRadius: 15,
      overflow: 'hidden',
    },
    messageContainer: {
      maxWidth: '80%',
      marginVertical: 5,
      padding: 10,
      borderRadius: 15,
    },
    ownMessageContainer: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
    },
    otherMessageContainer: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surface,
    },
    ownMessageText: {
      color: theme.colors.white,
    },
    otherMessageText: {
      color: theme.colors.text,
    },
    mediaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    mediaIcon: {
      fontSize: 24,
      marginRight: 10,
    },
    mediaLabel: {
      marginLeft: 8,
      fontSize: 16,
    },
    messageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    timestamp: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginRight: 5,
    },
    thumbnail: {
      width: 200,
      height: 200,
      borderRadius: 15,
    },
    absoluteFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.overlay,
    },
    sendButtonText: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    mediaThumbnail: {
      width: 200,
      height: 150,
      borderRadius: 10,
    },
    sendingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    formFieldContainer: {
      flex: 1,
      marginBottom: 0,
    },
  });
