/**
 * AI Service
 * Handles AI-related operations including conversations, messages, and posts
 */

import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type {
  AIConversation,
  AIMessage,
  AIPost,
  QueryAIRequest,
  QueryAIResponse,
  CreateAIPostRequest,
} from '../types';

/**
 * Query the AI model with a prompt and optional conversation context
 */
export async function queryAI(request: QueryAIRequest): Promise<QueryAIResponse> {
  try {
    logger.log('AI Service: Querying AI model', {
      prompt: `${request.prompt.substring(0, 50)}...`,
    });

    // Get the current session for auth headers
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // Call the Node.js API endpoint
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/query-rag-model`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error ?? `HTTP ${response.status}`);
    }

    const data = await response.json();
    logger.log('AI Service: Successfully received AI response');
    return data;
  } catch (error) {
    logger.error('AI Service: Error in queryAI', error);
    throw error;
  }
}

/**
 * Get all AI conversations for the current user
 */
export async function getUserAIConversations(): Promise<AIConversation[]> {
  try {
    logger.log('AI Service: Fetching user AI conversations');

    const { data, error } = await supabase.rpc('get_user_ai_conversations');

    if (error) {
      logger.error('AI Service: Error fetching conversations', error);
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    logger.log('AI Service: Successfully fetched conversations', { count: data?.length ?? 0 });
    return data ?? [];
  } catch (error) {
    logger.error('AI Service: Error in getUserAIConversations', error);
    throw error;
  }
}

/**
 * Get messages for a specific AI conversation
 */
export async function getAIConversationMessages(conversationId: string): Promise<AIMessage[]> {
  try {
    logger.log('AI Service: Fetching conversation messages', { conversationId });

    const { data, error } = await supabase.rpc('get_ai_conversation_messages', {
      conversation_uuid: conversationId,
    });

    if (error) {
      logger.error('AI Service: Error fetching conversation messages', error);
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    logger.log('AI Service: Successfully fetched messages', { count: data?.length ?? 0 });
    return data ?? [];
  } catch (error) {
    logger.error('AI Service: Error in getAIConversationMessages', error);
    throw error;
  }
}

/**
 * Update the title of an AI conversation
 */
export async function updateAIConversationTitle(
  conversationId: string,
  title: string,
): Promise<void> {
  try {
    logger.log('AI Service: Updating conversation title', { conversationId, title });

    const { error } = await supabase.rpc('update_ai_conversation_title', {
      conversation_uuid: conversationId,
      new_title: title,
    });

    if (error) {
      logger.error('AI Service: Error updating conversation title', error);
      throw new Error(`Failed to update title: ${error.message}`);
    }

    logger.log('AI Service: Successfully updated conversation title');
  } catch (error) {
    logger.error('AI Service: Error in updateAIConversationTitle', error);
    throw error;
  }
}

/**
 * Create a new AI conversation
 */
export async function createAIConversation(
  title: string = 'untitled conversation',
): Promise<string> {
  try {
    logger.log('AI Service: Creating new AI conversation', { title });

    const { data, error } = await supabase.rpc('create_ai_conversation', {
      conversation_title: title,
    });

    if (error) {
      logger.error('AI Service: Error creating conversation', error);
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    logger.log('AI Service: Successfully created conversation', { conversationId: data });
    return data;
  } catch (error) {
    logger.error('AI Service: Error in createAIConversation', error);
    throw error;
  }
}

/**
 * Get public AI posts feed
 */
export async function getPublicFeed(limit: number = 20, offset: number = 0): Promise<AIPost[]> {
  try {
    logger.log('AI Service: Fetching public feed', { limit, offset });

    const { data, error } = await supabase.rpc('get_public_feed', {
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      logger.error('AI Service: Error fetching public feed', error);
      throw new Error(`Failed to fetch public feed: ${error.message}`);
    }

    logger.log('AI Service: Successfully fetched public feed', { count: data?.length ?? 0 });
    return data ?? [];
  } catch (error) {
    logger.error('AI Service: Error in getPublicFeed', error);
    throw error;
  }
}

/**
 * Get friends AI posts feed
 */
export async function getFriendFeed(limit: number = 20, offset: number = 0): Promise<AIPost[]> {
  try {
    logger.log('AI Service: Fetching friend feed', { limit, offset });

    const { data, error } = await supabase.rpc('get_friend_feed', {
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      logger.error('AI Service: Error fetching friend feed', error);
      throw new Error(`Failed to fetch friend feed: ${error.message}`);
    }

    logger.log('AI Service: Successfully fetched friend feed', { count: data?.length ?? 0 });
    return data ?? [];
  } catch (error) {
    logger.error('AI Service: Error in getFriendFeed', error);
    throw error;
  }
}

/**
 * Create a new AI post
 */
export async function createAIPost(request: CreateAIPostRequest): Promise<string> {
  try {
    logger.log('AI Service: Creating AI post', { privacy: request.post_privacy });

    const { data, error } = await supabase.rpc('create_ai_post', {
      commentary: request.commentary,
      ai_content: request.ai_content,
      source_url: request.source_url ?? null,
      post_privacy: request.post_privacy,
    });

    if (error) {
      logger.error('AI Service: Error creating AI post', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }

    logger.log('AI Service: Successfully created AI post', { postId: data });
    return data;
  } catch (error) {
    logger.error('AI Service: Error in createAIPost', error);
    throw error;
  }
}
