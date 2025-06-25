/**
 * Chat and messaging type definitions
 * Defines interfaces for real-time chat functionality
 */

export interface Message {
  id: number;
  sender_id: string;
  sender_username: string;
  content_type: 'text' | 'image' | 'video';
  content_text?: string;
  storage_path?: string;
  created_at: string;
  viewed_at?: string;
  is_own_message: boolean;
}

export interface Conversation {
  chat_id: number;
  other_user_id: string;
  other_username: string;
  last_message_id: number;
  last_message_content: string | null;
  last_message_type: string;
  last_message_sender_id?: string;
  last_message_created_at?: string;
  last_message_viewed_at?: string;
  last_activity: string;
  unread_count: number;
}

export interface Chat {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  chat_id: number;
  user_id: string;
  joined_at: string;
}

export interface MessageReadEvent {
  chat_id: number;
  viewed_by: string;
  viewed_at: string;
  message_count: number;
}

export type ConversationStatus = 
  | 'new_message'
  | 'sent_unread'
  | 'sent_read'
  | 'received_read'
  | 'new_friend';

export interface ConversationListItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: (chatId: number, otherUserId: string, otherUsername: string) => void;
} 