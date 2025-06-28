/**
 * AI Home Screen
 * Displays user's AI conversations with ability to create new chats
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../styles/theme';
import { getUserAIConversations } from '../../services/ai';
import { Icon, AIConversationSkeleton } from '../../components';
import type { AIConversation } from '../../types';

import { styles } from './styles';

const AIHomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dynamicStyles = styles(theme);

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  /**
   * Load AI conversations from the server
   */
  const loadConversations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getUserAIConversations();
      setConversations(data);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = () => {
    loadConversations(true);
  };

  /**
   * Navigate to create a new AI chat
   */
  const handleNewChat = () => {
    // TODO: Update navigation types to include AIChatScreen
    // @ts-ignore - Navigation type needs to be updated to include AIChatScreen
    navigation.navigate('AIChatScreen', { conversationId: null });
  };

  /**
   * Navigate to an existing conversation
   */
  const handleConversationPress = (conversation: AIConversation) => {
    // TODO: Update navigation types to include AIChatScreen
    // @ts-ignore - Navigation type needs to be updated to include AIChatScreen
    navigation.navigate('AIChatScreen', {
      conversationId: conversation.id,
      conversationTitle: conversation.title,
    });
  };

  /**
   * Format the conversation's last activity time
   */
  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  /**
   * Render a single conversation item
   */
  const renderConversationItem = ({ item }: { item: AIConversation }) => (
    <TouchableOpacity
      style={dynamicStyles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={dynamicStyles.conversationContent}>
        <Text style={dynamicStyles.conversationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={dynamicStyles.conversationMeta}>
          {item.message_count} messages • {formatLastActivity(item.last_message_at)}
        </Text>
      </View>
      <Icon name='chevron-right' size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  /**
   * Render empty state when no conversations exist
   */
  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <Icon name='message-circle' size={64} color={theme.colors.textSecondary} />
      <Text style={dynamicStyles.emptyStateTitle}>No AI Conversations</Text>
      <Text style={dynamicStyles.emptyStateSubtitle}>
        Start your first conversation with our AI assistant
      </Text>
    </View>
  );

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>AI Assistant</Text>
        <TouchableOpacity style={dynamicStyles.newChatButton} onPress={handleNewChat}>
          <Icon name='plus' size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && !hasLoadedOnce ? (
        <AIConversationSkeleton count={6} />
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={dynamicStyles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.surface}
            />
          }
          ListEmptyComponent={!loading && !refreshing ? renderEmptyState : null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default AIHomeScreen;
