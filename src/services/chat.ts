/**
 * Chat Service
 * Handles all chat-related backend interactions with Supabase
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type { Conversation, Message } from '../types/chat';

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
    
    logger.info(`Successfully fetched ${data?.length || 0} conversations`);
    return data || [];
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
    
    logger.info(`Successfully fetched ${data?.length || 0} messages for chat ${chatId}`);
    return data || [];
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
      other_user_id: otherUserId,
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