/**
 * AI-related TypeScript type definitions
 * Contains types for conversations, messages, and posts
 */

export interface Source {
  url: string;
  companyName: string;
  filingDate: string;
  accessionNumber: string;
  filingType: string; // e.g., "10-K", "10-Q", etc.
}

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  last_message_at: string;
  message_count: number;
  last_message_content?: string;
  last_message_metadata?: {
    sources?: Source[];
    [key: string]: unknown;
  };
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  metadata?: {
    sources?: Source[];
    [key: string]: unknown;
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
  id: string;
  sender: 'ai';
  content: string;
  created_at: string;
  metadata: {
    sources: Source[];
    timestamp: string;
  };
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
