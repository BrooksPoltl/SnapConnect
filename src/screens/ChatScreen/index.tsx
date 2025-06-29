/**
 * ChatScreen Component
 *
 * Displays a list of all active conversations for the current user.
 * Shows real-time updates for new messages and read receipts.
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

import { ConversationCard, ConversationListSkeleton, ScreenHeader } from '../../components';
import { useTheme } from '../../styles/theme';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { getOrCreateDirectChat } from '../../services/chat';
import { useConversations } from '../../stores';
import { logger } from '../../utils/logger';
import { logOut } from '../../services/auth';
import { UserStackParamList } from '../../types/navigation';
import { Conversation } from '../../types/chat';

import { styles } from './styles';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const { user: _user } = useAuthentication();
  const { conversations, refreshConversations, isLoading } = useConversations();

  /**
   * Handles pull-to-refresh functionality
   */
  const handleRefresh = useCallback(() => {
    refreshConversations();
  }, [refreshConversations]);

  /**
   * Handles user logout
   */
  const handleLogOut = useCallback(async () => {
    try {
      await logOut();
      // Sign-out successful - navigation handled by useAuthentication hook
    } catch (error) {
      logger.error('ChatScreen: Sign out error', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }, []);

  /**
   * Navigates to the conversation screen
   */
  const handleConversationPress = useCallback(
    async (chatId: number, otherUserId: string, otherUsername: string) => {
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
    },
    [navigation],
  );

  // Refresh conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshConversations();
    }, [refreshConversations]),
  );

  /**
   * Renders a single conversation item
   */
  const renderConversationItem = ({ item }: { item: Conversation }) => {
    // Format the last message display text
    const getLastMessageText = () => {
      if (item.last_message_content?.trim()) {
        return item.last_message_content;
      }
      switch (item.last_message_type) {
        case 'image':
          return 'Photo';
        case 'video':
          return 'Video';
        default:
          return 'Message';
      }
    };

    // Format subtitle with message preview and status
    const subtitle = item.last_message_id ? getLastMessageText() : 'Tap to start chatting';

    return (
      <ConversationCard
        title={item.other_username}
        subtitle={subtitle}
        leftIcon='user'
        unreadCount={item.unread_count > 0 ? item.unread_count : undefined}
        onPress={() =>
          handleConversationPress(item.chat_id, item.other_user_id, item.other_username)
        }
        testID={`conversation-${item.chat_id}`}
      />
    );
  };

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

  if (isLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <ScreenHeader
          title='Chat'
          showRightAction={true}
          rightActionIcon='log-out'
          onRightActionPress={handleLogOut}
        />
        <ConversationListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScreenHeader
        title='Chat'
        showRightAction={true}
        rightActionIcon='log-out'
        onRightActionPress={handleLogOut}
      />

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.chat_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
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
