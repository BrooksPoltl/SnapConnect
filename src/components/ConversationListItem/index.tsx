/**
 * ConversationListItem Component
 *
 * Displays a single conversation in the chat list with dynamic status indicators.
 * Shows avatar, username, last message preview, and status icons based on message state.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from '../';
import { useTheme } from '../../styles/theme';
import { ConversationListItemProps, ConversationStatus } from '../../types/chat';

import { styles } from './styles';

/**
 * Determines the conversation status based on message data
 * @param conversation - The conversation object
 * @param currentUserId - The current user's ID
 * @returns ConversationStatus - The status to display
 */
function getConversationStatus(
  conversation: ConversationListItemProps['conversation'],
  currentUserId: string,
): ConversationStatus {
  const { last_message_id, last_message_sender_id, last_message_viewed_at } = conversation;

  // No messages exchanged yet (new friend)
  if (!last_message_id || last_message_id === 0) {
    return 'new_friend';
  }

  const isOwnMessage = last_message_sender_id === currentUserId;
  const isViewed = !!last_message_viewed_at;

  if (isOwnMessage) {
    // Current user sent the last message
    return isViewed ? 'sent_read' : 'sent_unread';
  } else {
    // Other user sent the last message
    return isViewed ? 'received_read' : 'new_message';
  }
}

/**
 * Gets the display text for the last message based on content type
 * @param conversation - The conversation object
 * @returns string - The text to display for the last message
 */
function getLastMessageDisplayText(
  conversation: ConversationListItemProps['conversation'],
): string {
  const { last_message_content, last_message_type } = conversation;

  // If we have text content, show it
  if (last_message_content && last_message_content.trim()) {
    return last_message_content;
  }

  // If no text content, show appropriate label based on content type
  switch (last_message_type) {
    case 'image':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'text':
      return 'Message'; // Fallback for empty text messages
    default:
      return 'Message'; // Fallback for unknown types
  }
}

/**
 * Gets the appropriate icon configuration for the conversation status
 */
function getStatusIconConfig(status: ConversationStatus, theme: any) {
  switch (status) {
    case 'new_message':
      return {
        name: 'message-square',
        color: theme.colors.primary,
        filled: true,
        text: 'New Message',
        textColor: theme.colors.primary,
      };
    case 'sent_unread':
      return {
        name: 'send',
        color: theme.colors.accent,
        filled: true,
        text: 'Sent',
        textColor: theme.colors.accent,
      };
    case 'sent_read':
      return {
        name: 'send',
        color: theme.colors.accent,
        filled: false,
        text: 'Opened',
        textColor: theme.colors.text,
      };
    case 'received_read':
      return {
        name: 'message-square',
        color: theme.colors.text,
        filled: false,
        text: 'Received',
        textColor: theme.colors.text,
      };
    case 'new_friend':
      return {
        name: 'message-square',
        color: theme.colors.textSecondary,
        filled: false,
        text: 'Tap to chat',
        textColor: theme.colors.textSecondary,
      };
    default:
      return {
        name: 'message-square',
        color: theme.colors.textSecondary,
        filled: false,
        text: '',
        textColor: theme.colors.textSecondary,
      };
  }
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentUserId,
  onPress,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const status = getConversationStatus(conversation, currentUserId);
  const iconConfig = getStatusIconConfig(status, theme);

  const handlePress = () => {
    onPress(conversation.chat_id, conversation.other_user_id, conversation.other_username);
  };

  // Get the first letter of the username for the avatar
  const avatarLetter = conversation.other_username.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={dynamicStyles.container}
      onPress={handlePress}
      accessibilityRole='button'
      accessibilityLabel={`Chat with ${conversation.other_username}`}
      accessibilityHint={iconConfig.text}
    >
      {/* Avatar */}
      <View style={dynamicStyles.avatar}>
        <Text style={dynamicStyles.avatarText}>{avatarLetter}</Text>
      </View>

      {/* Content */}
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.username} numberOfLines={1}>
          {conversation.other_username}
        </Text>

        {(conversation.last_message_content || conversation.last_message_type) && (
          <Text style={dynamicStyles.lastMessage} numberOfLines={1}>
            {getLastMessageDisplayText(conversation)}
          </Text>
        )}
      </View>

      {/* Status */}
      <View style={dynamicStyles.statusContainer}>
        <Icon
          name={iconConfig.name}
          size={20}
          color={iconConfig.color}
          style={
            iconConfig.filled
              ? dynamicStyles.statusIcon
              : { ...dynamicStyles.statusIcon, ...dynamicStyles.statusIconOutline }
          }
        />
        <Text style={[dynamicStyles.statusText, { color: iconConfig.textColor }]}>
          {iconConfig.text}
        </Text>

        {/* Unread count badge */}
        {conversation.unread_count > 0 && (
          <View style={dynamicStyles.unreadBadge}>
            <Text style={dynamicStyles.unreadBadgeText}>
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ConversationListItem;
