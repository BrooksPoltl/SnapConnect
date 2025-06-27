/**
 * AI-related TypeScript type definitions
 * Contains types for conversations, messages, and posts
 */

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  last_message_at: string;
  message_count: number;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  metadata?: {
    sources?: string[];
    [key: string]: any;
  };
  created_at: string;
}

export interface AIPost {
  id: string;
  user_id: string;
  username: string;
  user_commentary: string | null;
  ai_response: string;
  source_link: string | null;
  privacy: 'public' | 'friends';
  created_at: string;
}

export interface QueryAIRequest {
  prompt: string;
  conversationId?: string;
}

export interface QueryAIResponse {
  response: string;
  sources?: string[];
  conversationId: string;
}

export interface CreateAIPostRequest {
  commentary: string;
  ai_content: string;
  source_url?: string;
  post_privacy: 'public' | 'friends';
}

export interface GeneratePhotoCaptionRequest {
  image: string; // base64 encoded image
}

export interface GeneratePhotoCaptionResponse {
  caption: string;
}

export interface TranscribeVideoAudioRequest {
  file: FormData; // FormData containing the audio file
}

export interface TranscribeVideoAudioResponse {
  transcript: string;
}
