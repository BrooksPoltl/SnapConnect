/**
 * GroupConversationScreen - Main group chat interface
 * Displays group messages with sender information and allows sending new messages
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useGroupStore } from '../../stores/groupStore';
import { Avatar } from '../../components/Avatar';
import FormField from '../../components/FormField';
import type { GroupMessage, GroupConversationParams } from '../../types/groups';
import { styles } from './styles';

export const GroupConversationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, groupName } = route.params as GroupConversationParams;

  const {
    currentGroupMessages,
    loadGroupMessages,
    sendMessage,
    subscribeToGroup,
    unsubscribeFromGroup,
    markMessagesAsRead,
    isLoading,
    error,
    clearError,
  } = useGroupStore();

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages = currentGroupMessages[groupId] || [];

  // Load messages and subscribe to real-time updates
  useEffect(() => {
    loadGroupMessages(groupId);
    subscribeToGroup(groupId);
    markMessagesAsRead(groupId);

    return () => {
      unsubscribeFromGroup(groupId);
    };
  }, [groupId, loadGroupMessages, subscribeToGroup, unsubscribeFromGroup, markMessagesAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    const text = messageText.trim();
    setMessageText('');
    setIsSending(true);

    try {
      await sendMessage(groupId, text);
    } catch {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessageText(text); // Restore message text on error
    } finally {
      setIsSending(false);
    }
  };

  const handleGroupDetails = () => {
    // @ts-ignore - Navigation will be properly typed when navigation is set up
    navigation.navigate('GroupDetails', {
      groupId,
      groupName,
    });
  };

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isOwnMessage = item.is_own_message;

    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {!isOwnMessage && (
          <View style={styles.messageHeader}>
            <Avatar username={item.sender_username} size={32} />
            <Text style={styles.senderName}>{item.sender_username}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.content_text}
          </Text>
          <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {item.status === 'sending' && <Text style={styles.sendingStatus}>Sending...</Text>}
        {item.status === 'failed' && <Text style={styles.failedStatus}>Failed to send</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color='#007AFF' />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Avatar username={groupName} size={36} />
            <View style={styles.headerText}>
              <Text style={styles.groupName}>{groupName}</Text>
              <Text style={styles.memberCount}>Group</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleGroupDetails} style={styles.detailsButton}>
            <Ionicons name='information-circle-outline' size={24} color='#007AFF' />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No messages yet</Text>
                <Text style={styles.emptyStateSubtext}>Start the conversation!</Text>
              </View>
            ) : null
          }
        />

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.dismissError}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <FormField
            variant='chat'
            value={messageText}
            onChangeText={setMessageText}
            placeholder='Type a message...'
            multiline
            maxLength={1000}
            disabled={isSending}
            containerStyle={[styles.messageInputContainer]}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!messageText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            <Ionicons
              name='send'
              size={20}
              color={messageText.trim() && !isSending ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
