/**
 * AI Home Screen
 * Displays user's AI conversations with ability to create new chats
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../styles/theme';
import { getUserAIConversations } from '../../services/ai';
import {
  AIConversationSkeleton,
  ConversationCard,
  ScreenHeader,
  FadeInAnimation,
} from '../../components';
import Icon from '../../components/Icon';
import type { AIConversation } from '../../types';

import { styles } from './styles';

const AIHomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dynamicStyles = styles(theme);

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    <ConversationCard
      title={item.title}
      subtitle={`${item.message_count} messages • ${formatLastActivity(item.last_message_at)}`}
      leftIcon='message-circle'
      onPress={() => handleConversationPress(item)}
      testID={`ai-conversation-${item.id}`}
    />
  );

  /**
   * Render empty state when no conversations exist
   */
  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <Icon
        name='message-circle'
        size={64}
        color={theme.colors.textSecondary}
        backgroundContainer={true}
        containerColor={theme.colors.primary}
        containerSize={100}
        enable3D={true}
        shadowColor={theme.colors.primary}
        shadowOpacity={0.6}
      />
      <Text style={dynamicStyles.emptyStateTitle}>No AI Conversations</Text>
      <Text style={dynamicStyles.emptyStateSubtitle}>
        Start a conversation with AI to get personalized financial insights
      </Text>
    </View>
  );

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScreenHeader
        title='AI Assistant'
        showRightAction={true}
        rightActionIcon='plus'
        onRightActionPress={handleNewChat}
      />

      <FlatList
        data={loading || refreshing ? [] : conversations}
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
        ListFooterComponent={
          loading || refreshing ? (
            <FadeInAnimation>
              <AIConversationSkeleton count={6} />
            </FadeInAnimation>
          ) : !loading && !refreshing && conversations.length === 0 ? (
            <FadeInAnimation>{renderEmptyState()}</FadeInAnimation>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AIHomeScreen;
