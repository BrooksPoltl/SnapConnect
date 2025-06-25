/**
 * Chat Store - Global state management for chat functionality
 * 
 * Features:
 * - Unread message count with real-time updates
 * - Conversation list management
 * - Real-time subscription handling
 * - Automatic cleanup and state management
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../services/supabase';
import { getTotalUnreadCount, getConversations } from '../services/chat';
import { logger } from '../utils/logger';
import type { Conversation } from '../types/chat';
import type { User } from '@supabase/supabase-js';

interface ChatState {
  // Unread count state
  unreadCount: number;
  isLoadingUnreadCount: boolean;
  
  // Conversations state
  conversations: Conversation[];
  isLoadingConversations: boolean;
  
  // Real-time subscription
  realtimeChannel: any;
  
  // Actions
  refreshUnreadCount: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  initializeRealtime: (user: User) => void;
  cleanup: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    unreadCount: 0,
    isLoadingUnreadCount: false,
    conversations: [],
    isLoadingConversations: false,
    realtimeChannel: null,

    // Refresh unread count
    refreshUnreadCount: async () => {
      const { isLoadingUnreadCount } = get();
      if (isLoadingUnreadCount) return;

      try {
        set({ isLoadingUnreadCount: true });
        const count = await getTotalUnreadCount();
        set({ unreadCount: count });
        logger.info('Unread count refreshed:', count);
      } catch (error) {
        logger.error('Failed to refresh unread count:', error);
      } finally {
        set({ isLoadingUnreadCount: false });
      }
    },

    // Refresh conversations
    refreshConversations: async () => {
      const { isLoadingConversations } = get();
      if (isLoadingConversations) return;

      try {
        set({ isLoadingConversations: true });
        const conversations = await getConversations();
        set({ conversations });
        logger.info('Conversations refreshed:', conversations.length);
      } catch (error) {
        logger.error('Failed to refresh conversations:', error);
      } finally {
        set({ isLoadingConversations: false });
      }
    },

    // Initialize real-time subscriptions
    initializeRealtime: (user: User) => {
      const { cleanup, refreshUnreadCount, refreshConversations } = get();
      
      // Clean up existing subscription
      cleanup();

      const channel = supabase.channel(`chat:${user.id}`);

      // Listen for message inserts (new messages)
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          logger.info('New message detected, refreshing counts');
          refreshUnreadCount();
          refreshConversations();
        }
      );

      // Listen for message updates (messages marked as read)
      channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          logger.info('Message updated, refreshing counts');
          refreshUnreadCount();
          refreshConversations();
        }
      );

      channel.subscribe((status) => {
        logger.info('Chat store subscription status:', status);
      });

      set({ realtimeChannel: channel });
    },

    // Cleanup subscriptions
    cleanup: () => {
      const { realtimeChannel } = get();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        logger.info('Cleaned up chat store subscriptions');
      }
      set({ realtimeChannel: null });
    },

    // Reset store state
    reset: () => {
      const { cleanup } = get();
      cleanup();
      set({
        unreadCount: 0,
        isLoadingUnreadCount: false,
        conversations: [],
        isLoadingConversations: false,
        realtimeChannel: null,
      });
      logger.info('Chat store reset');
    },
  }))
);

// Helper hook for unread count only
export const useUnreadCount = () => {
  const unreadCount = useChatStore((state) => state.unreadCount);
  const refreshUnreadCount = useChatStore((state) => state.refreshUnreadCount);
  const isLoading = useChatStore((state) => state.isLoadingUnreadCount);
  
  return { unreadCount, refreshUnreadCount, isLoading };
};

// Helper hook for conversations only
export const useConversations = () => {
  const conversations = useChatStore((state) => state.conversations);
  const refreshConversations = useChatStore((state) => state.refreshConversations);
  const isLoading = useChatStore((state) => state.isLoadingConversations);
  
  return { conversations, refreshConversations, isLoading };
}; 