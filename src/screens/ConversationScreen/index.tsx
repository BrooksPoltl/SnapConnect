/**
 * ConversationScreen Component
 * 
 * Displays messages in a one-on-one conversation with real-time updates.
 * Handles sending messages and marking messages as read.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RealtimeChannel } from '@supabase/supabase-js';

import { Icon } from '../../components';
import { useTheme } from '../../styles/theme';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { getChatMessages, sendMessage, markMessagesAsRead } from '../../services/chat';
import { supabase } from '../../services/supabase';
import { useChatStore } from '../../stores';
import { logger } from '../../utils/logger';
import { UserStackParamList } from '../../types/navigation';
import { Message, MessageReadEvent } from '../../types/chat';

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
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  /**
   * Fetches messages for the current chat
   */
  const fetchMessages = useCallback(async () => {
    try {
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
      sender_username: user.email || 'You',
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
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, id: messageId }
          : msg
      ));
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
   * Sets up real-time subscriptions for this chat
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user) return;

    const channel = supabase.channel(`chat:${chatId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: user.id },
      },
    });

    // Listen for new messages in this chat
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        logger.info('New message received in chat:', payload);
        const newMessage = payload.new as Message;
        
        // Only add the message if it's not from the current user (to avoid duplicates)
        if (newMessage.sender_id !== user.id) {
          // Add sender username and is_own_message flag
          const messageWithMetadata: Message = {
            ...newMessage,
            sender_username: otherUsername,
            is_own_message: false,
          };

          setMessages(prev => [...prev, messageWithMetadata]);
          
          // Auto-scroll to bottom when new message arrives
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    );

    // Listen for message updates (when messages are marked as viewed)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        logger.info('Message updated in chat:', payload);
        const updatedMessage = payload.new as Message;
        
        // Update the message in local state
        setMessages(prev => prev.map(msg => {
          if (msg.id === updatedMessage.id) {
            return {
              ...msg,
              viewed_at: updatedMessage.viewed_at,
            };
          }
          return msg;
        }));
      }
    );

    // Subscribe with error handling
    channel.subscribe((status, err) => {
      logger.info('Chat realtime subscription status:', status);
      if (err) {
        logger.error('Chat realtime subscription error:', err);
      }
      
      if (status === 'SUBSCRIBED') {
        logger.info('Successfully subscribed to chat realtime updates');
      } else if (status === 'CHANNEL_ERROR') {
        logger.error('Chat channel error - will not attempt reconnect to avoid loops');
      } else if (status === 'CLOSED') {
        logger.warn('Chat realtime connection closed');
      }
    });

    setRealtimeChannel(channel);
  }, [user, chatId, otherUsername]);



  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [fetchMessages, markAsRead]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (user) {
      setupRealtimeSubscriptions();
    }
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        setRealtimeChannel(null);
        logger.info('Cleaned up chat realtime subscriptions');
      }
    };
  }, [user, chatId]); // Only depend on user and chatId

  /**
   * Renders a single message
   */
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      dynamicStyles.messageContainer,
      item.is_own_message ? dynamicStyles.ownMessage : dynamicStyles.otherMessage,
    ]}>
      <View style={[
        dynamicStyles.messageBubble,
        item.is_own_message ? dynamicStyles.ownMessageBubble : dynamicStyles.otherMessageBubble,
      ]}>
        <Text style={[
          dynamicStyles.messageText,
          item.is_own_message ? dynamicStyles.ownMessageText : dynamicStyles.otherMessageText,
        ]}>
          {item.content_text}
        </Text>
        <Text style={[
          dynamicStyles.messageTime,
          item.is_own_message ? dynamicStyles.ownMessageTime : dynamicStyles.otherMessageTime,
        ]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {item.is_own_message && (
            <Text style={dynamicStyles.readStatus}>
              {item.viewed_at ? ' ✓✓' : ' ✓'}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>{otherUsername}</Text>
          <View style={dynamicStyles.headerRight} />
        </View>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>{otherUsername}</Text>
        <View style={dynamicStyles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={dynamicStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={dynamicStyles.messagesList}
          contentContainerStyle={dynamicStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              dynamicStyles.sendButton,
              (!messageText.trim() || sending) && dynamicStyles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sending}
          >
            <Icon 
              name="send" 
              size={20} 
              color={(!messageText.trim() || sending) ? theme.colors.textSecondary : theme.colors.white} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationScreen;
