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
import { Alert } from 'react-native';

/**
 * Query the AI model with a prompt and optional conversation context
 */
export async function queryAI(request: QueryAIRequest): Promise<QueryAIResponse> {
  try {
    logger.log('AI Service: Querying AI model', {
      prompt: `${request.prompt.substring(0, 50)}...`,
    });

    const { data, error } = await supabase.functions.invoke('query-rag-model-deno', {
      body: request,
    });

    if (error) {
      throw error;
    }

    // The response now matches QueryAIResponse structure directly
    logger.log('AI Service: Successfully received AI response', {
      hasContent: !!data.content,
      sourceCount: data.metadata?.sources?.length ?? 0,
    });

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

/**
 * Generates a caption for a photo using the AI service.
 * @param image - The base64-encoded image data.
 * @returns The generated caption or null if an error occurs.
 */
export const generatePhotoCaption = async (image: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-photo-caption', {
      body: { image },
    });

    if (error) throw error;
    if (!data.caption) throw new Error('No caption was generated.');

    return data.caption;
  } catch (error: unknown) {
    Alert.alert('Error', (error as Error).message ?? 'Failed to generate photo caption.');
    return null;
  }
};

/**
 * Transcribes the audio from a video file.
 * @param audioUri - The local URI of the audio file.
 * @returns The transcribed text or null if an error occurs.
 */
export const transcribeVideoAudio = async (audioUri: string): Promise<string | null> => {
  try {
    const formData = new FormData();

    // The asset URI needs to be converted to something that can be sent in FormData.
    // This is a workaround for React Native's FormData typing limitations.
    formData.append('file', {
      uri: audioUri,
      name: 'audio.m4a',
      type: 'audio/m4a',
    } as unknown as Blob);

    const { data, error } = await supabase.functions.invoke('transcribe-video-audio', {
      body: formData,
    });

    if (error) throw error;
    if (!data.transcript) throw new Error('No transcript was generated.');

    return data.transcript;
  } catch (error: unknown) {
    Alert.alert('Error', (error as Error).message ?? 'Failed to transcribe audio.');
    return null;
  }
};
