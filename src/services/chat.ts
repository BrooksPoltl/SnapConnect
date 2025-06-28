/**
 * Chat Service
 * Handles all chat-related backend interactions with Supabase
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type { Conversation, Message } from '../types/chat';
import type { CapturedMedia } from '../types/media';
import { uploadMedia } from './media';

/**
 * Fetches all conversations for the current user
 * @returns Promise<Conversation[]> - List of conversations sorted by last activity
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    logger.info('Fetching user conversations');

    const { data, error } = await supabase.rpc('get_user_conversations');

    if (error) {
      logger.error('Error fetching conversations:', error);
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    logger.info(`Successfully fetched ${data?.length ?? 0} conversations`);
    return data ?? [];
  } catch (error) {
    logger.error('Error in getConversations:', error);
    throw error;
  }
}

/**
 * Marks all unread messages in a chat as viewed
 * @param chatId - The ID of the chat
 */
export async function markMessagesAsRead(chatId: number): Promise<void> {
  try {
    logger.info(`Marking messages as read for chat ${chatId}`);

    const { error } = await supabase.rpc('mark_messages_as_viewed', {
      p_chat_id: chatId,
    });

    if (error) {
      logger.error('Error marking messages as read:', error);
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }

    logger.info(`Successfully marked messages as read for chat ${chatId}`);
  } catch (error) {
    logger.error('Error in markMessagesAsRead:', error);
    throw error;
  }
}

/**
 * Sends a text message to a chat
 * @param chatId - The ID of the chat
 * @param content - The text content of the message
 * @returns Promise<number> - The ID of the created message
 */
export async function sendMessage(chatId: number, content: string): Promise<number> {
  try {
    logger.info(`Sending message to chat ${chatId}`);

    const { data, error } = await supabase.rpc('send_message', {
      p_chat_id: chatId,
      p_content_text: content,
    });

    if (error) {
      logger.error('Error sending message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }

    logger.info(`Successfully sent message ${data} to chat ${chatId}`);
    return data;
  } catch (error) {
    logger.error('Error in sendMessage:', error);
    throw error;
  }
}

/**
 * Fetches messages for a specific chat
 * @param chatId - The ID of the chat
 * @param limit - Maximum number of messages to fetch (default: 50)
 * @returns Promise<Message[]> - List of messages in the chat
 */
export async function getChatMessages(chatId: number, limit: number = 50): Promise<Message[]> {
  try {
    logger.info(`Fetching messages for chat ${chatId} (limit: ${limit})`);

    const { data, error } = await supabase.rpc('get_chat_messages', {
      p_chat_id: chatId,
      p_limit: limit,
    });

    if (error) {
      logger.error('Error fetching chat messages:', error);
      throw new Error(`Failed to fetch chat messages: ${error.message}`);
    }

    logger.info(`Successfully fetched ${data?.length ?? 0} messages for chat ${chatId}`);
    return data ?? [];
  } catch (error) {
    logger.error('Error in getChatMessages:', error);
    throw error;
  }
}

/**
 * Creates or gets an existing direct chat with another user
 * @param otherUserId - The ID of the other user
 * @returns Promise<number> - The chat ID
 */
export async function getOrCreateDirectChat(otherUserId: string): Promise<number> {
  try {
    logger.info(`Getting or creating direct chat with user ${otherUserId}`);

    const { data, error } = await supabase.rpc('create_direct_chat', {
      p_recipient_id: otherUserId,
    });

    if (error) {
      logger.error('Error creating/getting direct chat:', error);
      throw new Error(`Failed to create/get direct chat: ${error.message}`);
    }

    logger.info(`Successfully got/created chat ${data} with user ${otherUserId}`);
    return data;
  } catch (error) {
    logger.error('Error in getOrCreateDirectChat:', error);
    throw error;
  }
}

/**
 * Gets the total unread message count for the current user
 * @returns Promise<number> - Total number of unread messages across all chats
 */
export async function getTotalUnreadCount(): Promise<number> {
  try {
    logger.info('Fetching total unread message count');

    const { data, error } = await supabase.rpc('get_total_unread_count');

    if (error) {
      logger.error('Error fetching total unread count:', error);
      throw new Error(`Failed to fetch total unread count: ${error.message}`);
    }

    const count = data ?? 0;
    logger.info(`Total unread messages: ${count}`);
    return count;
  } catch (error) {
    logger.error('Error in getTotalUnreadCount:', error);
    throw error;
  }
}

/**
 * Uploads a media file and calls an RPC to send it to multiple friends.
 * @param mediaFile - The local media file to send.
 * @param recipientIds - An array of friend UUIDs to send to.
 */
export async function sendMediaToFriends(
  mediaFile: CapturedMedia,
  recipientIds: string[],
): Promise<void> {
  if (recipientIds.length === 0) {
    logger.warn('sendMediaToFriends called with no recipients.');
    return;
  }

  try {
    logger.info(`Sending media to ${recipientIds.length} friends.`);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated to send media.');

    // 1. Generate a unique file path for the media.
    const fileExt = mediaFile.uri.split('.').pop() ?? 'jpg';
    const fileName = `chat_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 2. Upload the media file using the centralized service.
    const storagePath = await uploadMedia(mediaFile, 'media', filePath);

    // 3. Call the RPC to distribute the message to all recipients.
    const { error } = await supabase.rpc('send_media_to_friends', {
      p_storage_path: storagePath,
      p_content_type: mediaFile.type === 'photo' ? 'image' : 'video',
      p_recipient_ids: recipientIds,
    });

    if (error) {
      // If the RPC fails, attempt to clean up the orphaned file.
      logger.error('RPC call to send_media_to_friends failed.', { error });
      await supabase.storage.from('media').remove([storagePath]);
      logger.info('Cleaned up orphaned media file from storage.', { storagePath });
      throw error;
    }

    logger.info('Successfully initiated media send to friends.');
  } catch (error) {
    logger.error('An error occurred in sendMediaToFriends.', { error });
    throw error;
  }
}
