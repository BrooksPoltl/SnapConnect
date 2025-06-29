/**
 * ConversationScreen Component
 *
 * Displays messages in a one-on-one conversation with real-time updates.
 * Handles sending messages and marking messages as read.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { Icon, ScreenHeader } from '../../components';
import { useTheme } from '../../styles/theme';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import {
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  sendMediaToFriends,
} from '../../services/chat';
import { supabase } from '../../services/supabase';
import { useChatStore } from '../../stores';
import { logger } from '../../utils/logger';
import { useNavigation, UserStackParamList } from '../../types/navigation';
import { Message } from '../../types/chat';
import { CapturedMedia } from '../../types/media';
import FormField from '../../components/FormField';

import { styles } from './styles';

type ConversationScreenRouteProp = RouteProp<UserStackParamList, 'Conversation'>;

const ConversationScreen: React.FC = () => {
  const route = useRoute<ConversationScreenRouteProp>();
  const navigation = useNavigation();
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const { user } = useAuthentication();
  const { refreshUnreadCount } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  const { chatId, otherUserId, otherUsername } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /**
   * Fetches messages for the current chat
   */
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChatMessages(chatId);
      // Reverse the array since we want newest messages at the bottom
      setMessages(data.reverse());
      logger.info(`Loaded ${data.length} messages for chat ${chatId}`);
    } catch (error) {
      logger.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  /**
   * Marks messages as read when the screen is focused
   */
  const markAsRead = useCallback(async () => {
    try {
      await markMessagesAsRead(chatId);
      // Refresh unread count after marking messages as read
      refreshUnreadCount();
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  }, [chatId, refreshUnreadCount]);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch initial data
    fetchMessages();
    markAsRead();

    // 2. Set up real-time subscriptions
    const channel = supabase.channel(`chat:${chatId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: user.id },
      },
    });

    // Listen for new messages
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      payload => {
        logger.info('New message received in chat:', payload);
        const newMessage = payload.new as Message;

        const messageWithMetadata: Message = {
          ...newMessage,
          sender_username: newMessage.sender_id === user.id ? 'You' : otherUsername,
          is_own_message: newMessage.sender_id === user.id,
        };

        setMessages(prev => {
          // If it's our own message, find and replace the optimistic one
          if (messageWithMetadata.is_own_message) {
            // This is a simple replacement based on content and type,
            // since we don't have the final ID on the optimistic message.
            // A more robust solution might use a temporary unique ID.
            const existing = prev.find(
              m => m.status === 'sending' && m.local_uri === messageWithMetadata.local_uri,
            );
            if (existing) {
              return prev.map(m => (m.id === existing.id ? messageWithMetadata : m));
            }
          }
          // Add the new message if it's not a replacement or from another user
          if (!prev.some(m => m.id === messageWithMetadata.id)) {
            return [...prev, messageWithMetadata];
          }
          return prev;
        });

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      },
    );

    // Listen for message updates (e.g., read receipts)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      payload => {
        logger.info('Message updated in chat:', payload);
        const updatedMessage = payload.new as Message;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === updatedMessage.id ? { ...msg, viewed_at: updatedMessage.viewed_at } : msg,
          ),
        );
      },
    );

    channel.subscribe(status => {
      logger.info('Chat realtime subscription status:', status);
      if (status === 'SUBSCRIBED') {
        logger.info('Successfully subscribed to chat realtime updates');
      }
    });

    // 3. Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
      logger.info('Cleaned up chat realtime subscriptions');
    };
  }, [user, chatId, otherUsername, fetchMessages, markAsRead]);

  /**
   * Sends a new message
   */
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || sending || !user) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setSending(true);

    // Create optimistic message to show immediately
    const optimisticMessage: Message = {
      id: Date.now(), // Temporary ID
      sender_id: user.id,
      sender_username: user.email ?? 'You',
      content_type: 'text',
      content_text: textToSend,
      storage_path: undefined,
      created_at: new Date().toISOString(),
      viewed_at: undefined,
      is_own_message: true,
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, optimisticMessage]);

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const messageId = await sendMessage(chatId, textToSend);
      logger.info('Message sent successfully');

      // Update the optimistic message with the real ID from database
      setMessages(prev =>
        prev.map(msg => (msg.id === optimisticMessage.id ? { ...msg, id: messageId } : msg)),
      );
    } catch (error) {
      logger.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');

      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));

      // Restore the message text if sending failed
      setMessageText(textToSend);
    } finally {
      setSending(false);
    }
  }, [messageText, sending, chatId, user]);

  /**
   * Opens the device's image/video library and sends the selected media.
   */
  const handlePickMedia = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type !== 'image' && asset.type !== 'video') {
        Alert.alert('Unsupported File', 'Please select an image or video.');
        return;
      }

      const mediaFile: CapturedMedia = {
        uri: asset.uri,
        type: asset.type === 'image' ? 'photo' : 'video',
        width: asset.width,
        height: asset.height,
        duration: asset.duration ?? undefined,
      };

      const optimisticMessage: Message = {
        id: Date.now(),
        sender_id: user.id,
        sender_username: 'You',
        content_type: mediaFile.type === 'photo' ? 'image' : 'video',
        created_at: new Date().toISOString(),
        is_own_message: true,
        local_uri: mediaFile.uri,
        status: 'sending',
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

      try {
        await sendMediaToFriends(mediaFile, [otherUserId]);
        // On success, refresh messages to get the final version from the server
        await fetchMessages();
      } catch (error) {
        logger.error('Error sending media message from picker:', error);
        Alert.alert('Error', 'Failed to send media.');
        // On failure, remove the optimistic message
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      }
    }
  };

  /**
   * Renders a single message
   */
  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.sender_id === user?.id;

    const renderMediaThumbnail = () => {
      // Optimistic message with a local URI
      if (item.local_uri) {
        return (
          <View>
            <Image source={{ uri: item.local_uri }} style={dynamicStyles.mediaThumbnail} />
            {item.status === 'sending' && (
              <View style={dynamicStyles.sendingOverlay}>
                <ActivityIndicator size='large' color={theme.colors.white} />
              </View>
            )}
          </View>
        );
      }

      // Server message with a storage path
      if (item.storage_path) {
        const isPhoto = item.content_type === 'image';
        const iconName = isPhoto ? 'image' : 'video';
        const label = isPhoto ? 'Photo' : 'Video';
        const iconColor = isOwn ? theme.colors.white : theme.colors.text;

        const handlePress = () => {
          if (item.storage_path) {
            navigation.navigate('User', {
              screen: 'MediaViewer',
              params: {
                storage_path: item.storage_path,
                content_type: item.content_type as 'image' | 'video',
              },
            });
          }
        };

        return (
          <TouchableOpacity style={dynamicStyles.mediaContainer} onPress={handlePress}>
            <Icon name={iconName} size={24} color={iconColor} style={dynamicStyles.mediaIcon} />
            <Text style={[dynamicStyles.mediaLabel, { color: iconColor }]}>{label}</Text>
          </TouchableOpacity>
        );
      }

      return null;
    };

    return (
      <View
        style={[
          dynamicStyles.messageContainer,
          isOwn ? dynamicStyles.ownMessageContainer : dynamicStyles.otherMessageContainer,
        ]}
      >
        {item.content_type === 'text' ? (
          <Text style={isOwn ? dynamicStyles.ownMessageText : dynamicStyles.otherMessageText}>
            {item.content_text}
          </Text>
        ) : (
          renderMediaThumbnail()
        )}
        <View style={dynamicStyles.messageInfo}>
          <Text
            style={[
              dynamicStyles.timestamp,
              isOwn ? dynamicStyles.ownMessageText : dynamicStyles.otherMessageText,
            ]}
          >
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isOwn && item.viewed_at && <Icon name='eye' size={14} color={theme.colors.white} />}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <ScreenHeader
        title={otherUsername}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={dynamicStyles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={dynamicStyles.inputContainer}>
          <TouchableOpacity style={dynamicStyles.mediaButton} onPress={handlePickMedia}>
            <Icon name='plus' size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <FormField
            variant='chat'
            value={messageText}
            onChangeText={setMessageText}
            placeholder='Type a message...'
            multiline
            containerStyle={dynamicStyles.formFieldContainer}
          />
          <TouchableOpacity
            style={[
              dynamicStyles.sendButton,
              (sending || !messageText.trim()) && dynamicStyles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={sending || !messageText.trim()}
          >
            {sending ? (
              <ActivityIndicator size='small' color={theme.colors.white} />
            ) : (
              <Icon
                name='send'
                size={24}
                color={!messageText.trim() ? theme.colors.textSecondary : theme.colors.white}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationScreen;
