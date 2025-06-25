/**
 * ChatScreen Component
 * 
 * Displays a list of all active conversations for the current user.
 * Shows real-time updates for new messages and read receipts.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RealtimeChannel } from '@supabase/supabase-js';

import { ConversationListItem } from '../../components';
import { useTheme } from '../../styles/theme';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { getConversations, getOrCreateDirectChat } from '../../services/chat';
import { supabase } from '../../services/supabase';
import { logger } from '../../utils/logger';
import { UserStackParamList } from '../../types/navigation';
import { Conversation, MessageReadEvent } from '../../types/chat';

import { styles } from './styles';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const { user } = useAuthentication();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  /**
   * Fetches the latest conversations from the backend
   */
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getConversations();
      setConversations(data);
      logger.info(`Loaded ${data.length} conversations`);
    } catch (error) {
      logger.error('Error fetching conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  /**
   * Handles pull-to-refresh functionality
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, [fetchConversations]);

  /**
   * Navigates to the conversation screen
   */
  const handleConversationPress = useCallback(async (
    chatId: number,
    otherUserId: string,
    otherUsername: string,
  ) => {
    try {
      // If chatId is 0, we need to create a new chat
      let finalChatId = chatId;
      if (chatId === 0) {
        finalChatId = await getOrCreateDirectChat(otherUserId);
      }

      navigation.navigate('Conversation', {
        chatId: finalChatId,
        otherUserId,
        otherUsername,
      });
    } catch (error) {
      logger.error('Error navigating to conversation:', error);
      Alert.alert('Error', 'Failed to open conversation. Please try again.');
    }
  }, [navigation]);

  /**
   * Sets up real-time subscriptions for new messages and read receipts
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user) return;

    const channel = supabase.channel(`user_conversations:${user.id}`, {
      config: {
        broadcast: { self: true },
        presence: { key: user.id },
      },
    });

    // Listen for new messages in any of the user's chats
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        logger.info('New message received:', payload);
        // Refresh conversations to get updated last message info
        fetchConversations();
      }
    );

    // Listen for message updates (when messages are marked as viewed)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        logger.info('Message updated:', payload);
        // Refresh conversations to get updated viewed status
        fetchConversations();
      }
    );

    // Subscribe with error handling
    channel.subscribe((status, err) => {
      logger.info('Realtime subscription status:', status);
      if (err) {
        logger.error('Realtime subscription error:', err);
      }
      
      if (status === 'SUBSCRIBED') {
        logger.info('Successfully subscribed to realtime updates');
      } else if (status === 'CHANNEL_ERROR') {
        logger.error('Channel error - will not attempt reconnect to avoid loops');
      } else if (status === 'CLOSED') {
        logger.warn('Realtime connection closed');
      }
    });

    setRealtimeChannel(channel);
  }, [user, fetchConversations]);



  // Fetch conversations when component mounts or user changes
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Set up real-time subscriptions when component mounts
  useEffect(() => {
    if (user) {
      setupRealtimeSubscriptions();
    }
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        setRealtimeChannel(null);
        logger.info('Cleaned up realtime subscriptions');
      }
    };
  }, [user]); // Only depend on user, not the functions

  // Refresh conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [fetchConversations])
  );

  /**
   * Renders a single conversation item
   */
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <ConversationListItem
      conversation={item}
      currentUserId={user?.id || ''}
      onPress={handleConversationPress}
    />
  );

  /**
   * Renders empty state when no conversations exist
   */
  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <Text style={dynamicStyles.emptyStateTitle}>No conversations yet</Text>
      <Text style={dynamicStyles.emptyStateSubtitle}>
        Start chatting by adding friends and sending them messages!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerTitle}>Chat</Text>
        </View>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Chat</Text>
      </View>
      
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.chat_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        style={dynamicStyles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
