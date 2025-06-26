/**
 * AI Chat Screen
 * Provides a chat interface for interacting with the AI assistant
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useTheme } from '../../styles/theme';
import {
  queryAI,
  getAIConversationMessages,
  updateAIConversationTitle,
  // createAIConversation,
} from '../../services/ai';
import Icon from '../../components/Icon';
import type { AIMessage, QueryAIResponse } from '../../types';

import { styles } from './styles';

interface RouteParams {
  conversationId?: string | null;
  conversationTitle?: string;
}

const AIChatScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dynamicStyles = styles(theme);
  const flatListRef = useRef<FlatList>(null);

  const { conversationId: initialConversationId, conversationTitle } =
    (route.params as RouteParams) ?? {};

  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [title, setTitle] = useState(conversationTitle ?? 'untitled conversation');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<AIMessage | null>(null);

  /**
   * Load conversation messages if we have a conversation ID
   */
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const data = await getAIConversationMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load conversation history.');
    }
  }, [conversationId]);

  /**
   * Send a message to the AI
   */
  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      // Add user message to UI immediately
      const tempUserMessage: AIMessage = {
        id: `temp-${Date.now()}`,
        sender: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Query AI
      const response: QueryAIResponse = await queryAI({
        prompt: userMessage,
        conversationId: conversationId ?? undefined,
      });

      // Update conversation ID if this was a new conversation
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Reload messages to get the actual persisted messages
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the temporary user message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle title editing
   */
  const handleTitleSave = async () => {
    if (!conversationId || tempTitle.trim() === title) {
      setEditingTitle(false);
      return;
    }

    try {
      await updateAIConversationTitle(conversationId, tempTitle.trim());
      setTitle(tempTitle.trim());
      setEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
      Alert.alert('Error', 'Failed to update conversation title.');
      setTempTitle(title); // Reset temp title
    }
  };

  /**
   * Handle share button press
   */
  const handleShare = (message: AIMessage) => {
    if (message.sender !== 'ai') return;
    setSelectedMessage(message);
    setShowShareModal(true);
  };

  /**
   * Handle post to feed
   */
  const handlePostToFeed = () => {
    if (!selectedMessage) return;
    setShowShareModal(false);
    // TODO: Navigate to CreateAIPostScreen
    // TODO: Implement CreateAIPostScreen navigation
    Alert.alert('Coming Soon', 'Post to Feed feature will be available soon!');
  };

  /**
   * Handle send to friend
   */
  const handleSendToFriend = () => {
    if (!selectedMessage) return;
    setShowShareModal(false);
    // TODO: Navigate to SelectRecipientsScreen
    // TODO: Implement SelectRecipientsScreen navigation
    Alert.alert('Coming Soon', 'Send to Friend feature will be available soon!');
  };

  /**
   * Render a single message
   */
  const renderMessage = ({ item }: { item: AIMessage }) => (
    <View
      style={[
        dynamicStyles.messageContainer,
        item.sender === 'user' ? dynamicStyles.userMessage : dynamicStyles.aiMessage,
      ]}
    >
      <Text
        style={[
          dynamicStyles.messageText,
          item.sender === 'user' ? dynamicStyles.userMessageText : dynamicStyles.aiMessageText,
        ]}
      >
        {item.content}
      </Text>
      {item.sender === 'ai' && (
        <TouchableOpacity style={dynamicStyles.shareButton} onPress={() => handleShare(item)}>
          <Icon name='share' size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render share modal
   */
  const renderShareModal = () => (
    <Modal
      visible={showShareModal}
      transparent
      animationType='slide'
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={dynamicStyles.modalOverlay}>
        <View style={dynamicStyles.modalContent}>
          <Text style={dynamicStyles.modalTitle}>Share AI Response</Text>

          <TouchableOpacity style={dynamicStyles.modalButton} onPress={handlePostToFeed}>
            <Icon name='globe' size={20} color={theme.colors.primary} />
            <Text style={dynamicStyles.modalButtonText}>Post to Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.modalButton} onPress={handleSendToFriend}>
            <Icon name='message-circle' size={20} color={theme.colors.primary} />
            <Text style={dynamicStyles.modalButtonText}>Send to Friend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
            onPress={() => setShowShareModal(false)}
          >
            <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, loadMessages]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        style={dynamicStyles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <TouchableOpacity style={dynamicStyles.backButton} onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {editingTitle ? (
            <TextInput
              style={dynamicStyles.titleInput}
              value={tempTitle}
              onChangeText={setTempTitle}
              onBlur={handleTitleSave}
              onSubmitEditing={handleTitleSave}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity
              style={dynamicStyles.titleButton}
              onPress={() => {
                setTempTitle(title);
                setEditingTitle(true);
              }}
            >
              <Text style={dynamicStyles.title} numberOfLines={1}>
                {title}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={dynamicStyles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Ask about financial data...'
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              dynamicStyles.sendButton,
              (!inputText.trim() || loading) && dynamicStyles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Icon
              name={loading ? 'loader' : 'send'}
              size={20}
              color={!inputText.trim() || loading ? theme.colors.textSecondary : theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderShareModal()}
    </SafeAreaView>
  );
};

export default AIChatScreen;
