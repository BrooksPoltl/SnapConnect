/**
 * Group Store using Zustand
 * Manages group chat state including groups list, messages, and real-time subscriptions
 */
import { create } from 'zustand';
import type { Group, GroupMessage, GroupDetails } from '../types/groups';
import * as groupsService from '../services/groups';
import { logger } from '../utils/logger';

interface GroupStore {
  // State
  groups: Group[];
  currentGroupMessages: Record<number, GroupMessage[]>;
  currentGroupDetails: GroupDetails | null;
  isLoading: boolean;
  error: string | null;
  subscriptions: Record<number, { unsubscribe: () => void } | undefined>;

  // Actions
  loadGroups: () => Promise<void>;
  loadGroupMessages: (groupId: number) => Promise<void>;
  loadGroupDetails: (groupId: number) => Promise<void>;
  sendMessage: (groupId: number, content: string) => Promise<void>;
  createGroup: (name: string, memberIds: string[]) => Promise<number>;
  addMembers: (groupId: number, memberIds: string[]) => Promise<void>;
  leaveGroup: (groupId: number) => Promise<void>;
  markMessagesAsRead: (groupId: number) => Promise<void>;
  subscribeToGroup: (groupId: number) => void;
  unsubscribeFromGroup: (groupId: number) => void;
  clearGroupMessages: (groupId: number) => void;
  clearError: () => void;
  reset: () => void;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  // Initial state
  groups: [],
  currentGroupMessages: {},
  currentGroupDetails: null,
  isLoading: false,
  error: null,
  subscriptions: {},

  // Load user's groups
  loadGroups: async () => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', 'Loading user groups');

      const groups = await groupsService.getUserGroups();

      set({
        groups,
        isLoading: false,
      });

      logger.info('GroupStore', `Loaded ${groups.length} groups`);
    } catch (error) {
      logger.error('GroupStore', 'Error loading groups', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load groups',
        isLoading: false,
      });
    }
  },

  // Load messages for a specific group
  loadGroupMessages: async (groupId: number) => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', `Loading messages for group ${groupId}`);

      const messages = await groupsService.getGroupMessages(groupId);

      set(state => ({
        currentGroupMessages: {
          ...state.currentGroupMessages,
          [groupId]: messages.reverse(), // Reverse to show oldest first
        },
        isLoading: false,
      }));

      logger.info('GroupStore', `Loaded ${messages.length} messages for group ${groupId}`);
    } catch (error) {
      logger.error('GroupStore', 'Error loading group messages', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load messages',
        isLoading: false,
      });
    }
  },

  // Load detailed information about a group
  loadGroupDetails: async (groupId: number) => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', `Loading details for group ${groupId}`);

      const groupDetails = await groupsService.getGroupDetails(groupId);

      set({
        currentGroupDetails: groupDetails,
        isLoading: false,
      });

      logger.info('GroupStore', `Loaded details for group ${groupId}`);
    } catch (error) {
      logger.error('GroupStore', 'Error loading group details', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load group details',
        isLoading: false,
      });
    }
  },

  // Send a message to a group
  sendMessage: async (groupId: number, content: string) => {
    try {
      logger.info('GroupStore', `Sending message to group ${groupId}`);

      // Add optimistic message
      const tempMessage: GroupMessage = {
        id: Date.now(), // Temporary ID
        sender_id: '', // Will be filled by the service
        sender_username: 'You',
        content_type: 'text',
        content_text: content,
        created_at: new Date().toISOString(),
        is_own_message: true,
        status: 'sending',
      };

      set(state => ({
        currentGroupMessages: {
          ...state.currentGroupMessages,
          [groupId]: [...(state.currentGroupMessages[groupId] || []), tempMessage],
        },
      }));

      // Send the actual message
      const messageId = await groupsService.sendGroupMessage(groupId, content);

      // Update the temporary message with the real ID
      set(state => ({
        currentGroupMessages: {
          ...state.currentGroupMessages,
          [groupId]:
            state.currentGroupMessages[groupId]?.map(msg =>
              msg.id === tempMessage.id ? { ...msg, id: messageId, status: 'sent' } : msg,
            ) || [],
        },
      }));

      // Refresh groups list to update last message
      get().loadGroups();

      logger.info('GroupStore', `Message sent successfully to group ${groupId}`);
    } catch (error) {
      logger.error('GroupStore', 'Error sending message', error);

      // Mark the message as failed
      set(state => ({
        currentGroupMessages: {
          ...state.currentGroupMessages,
          [groupId]:
            state.currentGroupMessages[groupId]?.map(msg =>
              msg.id === Date.now() // Find the temp message
                ? { ...msg, status: 'failed' }
                : msg,
            ) || [],
        },
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  },

  // Create a new group
  createGroup: async (name: string, memberIds: string[]) => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', `Creating group: ${name}`);

      const groupId = await groupsService.createGroup({ name, memberIds });

      // Refresh groups list
      await get().loadGroups();

      set({ isLoading: false });
      logger.info('GroupStore', `Group created successfully with ID: ${groupId}`);

      return groupId;
    } catch (error) {
      logger.error('GroupStore', 'Error creating group', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create group',
        isLoading: false,
      });
      throw error;
    }
  },

  // Add members to a group
  addMembers: async (groupId: number, memberIds: string[]) => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', `Adding members to group ${groupId}`);

      await groupsService.addGroupMembers(groupId, memberIds);

      // Refresh group details if currently loaded
      if (get().currentGroupDetails?.id === groupId) {
        await get().loadGroupDetails(groupId);
      }

      set({ isLoading: false });
      logger.info('GroupStore', 'Members added successfully');
    } catch (error) {
      logger.error('GroupStore', 'Error adding members', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add members',
        isLoading: false,
      });
    }
  },

  // Leave a group
  leaveGroup: async (groupId: number) => {
    try {
      set({ isLoading: true, error: null });
      logger.info('GroupStore', `Leaving group ${groupId}`);

      await groupsService.leaveGroup(groupId);

      // Remove group from local state
      set(state => {
        const newMessages = { ...state.currentGroupMessages };
        delete newMessages[groupId];

        return {
          groups: state.groups.filter(group => group.group_id !== groupId),
          currentGroupMessages: newMessages,
          isLoading: false,
        };
      });

      // Unsubscribe from real-time updates
      get().unsubscribeFromGroup(groupId);

      logger.info('GroupStore', 'Successfully left group');
    } catch (error) {
      logger.error('GroupStore', 'Error leaving group', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to leave group',
        isLoading: false,
      });
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (groupId: number) => {
    try {
      await groupsService.markGroupMessagesAsRead(groupId);

      // Update local state to show messages as read
      set(state => ({
        groups: state.groups.map(group =>
          group.group_id === groupId ? { ...group, unread_count: 0 } : group,
        ),
      }));

      logger.info('GroupStore', `Marked messages as read for group ${groupId}`);
    } catch (error) {
      logger.error('GroupStore', 'Error marking messages as read', error);
    }
  },

  // Subscribe to real-time updates for a group
  subscribeToGroup: (groupId: number) => {
    const { subscriptions } = get();

    // Don't subscribe if already subscribed
    if (subscriptions[groupId]) {
      return;
    }

    logger.info('GroupStore', `Subscribing to real-time updates for group ${groupId}`);

    const subscription = groupsService.subscribeToGroupMessages(groupId, message => {
      set(state => {
        const existingMessages = state.currentGroupMessages[groupId] || [];

        // Check if this is our own message that we sent optimistically
        if (message.is_own_message) {
          // Find and replace the optimistic message (status: 'sending' or 'sent')
          const optimisticMessageIndex = existingMessages.findIndex(
            msg => msg.status === 'sending' && msg.content_text === message.content_text,
          );

          if (optimisticMessageIndex !== -1) {
            // Replace the optimistic message with the real one
            const updatedMessages = [...existingMessages];
            updatedMessages[optimisticMessageIndex] = {
              ...message,
              status: 'sent',
            };

            return {
              currentGroupMessages: {
                ...state.currentGroupMessages,
                [groupId]: updatedMessages,
              },
            };
          }
        }

        // Check if we already have this message (prevent duplicates)
        const messageExists = existingMessages.some(msg => msg.id === message.id);
        if (messageExists) {
          return state; // Don't add duplicate
        }

        // Add the new message to the store
        return {
          currentGroupMessages: {
            ...state.currentGroupMessages,
            [groupId]: [...existingMessages, message],
          },
        };
      });

      // Update groups list to show new last message
      get().loadGroups();
    });

    set(state => ({
      subscriptions: {
        ...state.subscriptions,
        [groupId]: subscription,
      },
    }));
  },

  // Unsubscribe from real-time updates for a group
  unsubscribeFromGroup: (groupId: number) => {
    const { subscriptions } = get();
    const subscription = subscriptions[groupId];

    if (subscription) {
      logger.info('GroupStore', `Unsubscribing from group ${groupId}`);
      subscription.unsubscribe();

      set(state => {
        const newSubscriptions = { ...state.subscriptions };
        delete newSubscriptions[groupId];

        return {
          subscriptions: newSubscriptions,
        };
      });
    }
  },

  // Clear messages for a specific group
  clearGroupMessages: (groupId: number) => {
    set(state => ({
      currentGroupMessages: {
        ...state.currentGroupMessages,
        [groupId]: [],
      },
    }));
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  },

  // Reset store to initial state
  reset: () => {
    const { subscriptions } = get();

    // Unsubscribe from all active subscriptions
    Object.values(subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });

    set({
      groups: [],
      currentGroupMessages: {},
      currentGroupDetails: null,
      isLoading: false,
      error: null,
      subscriptions: {},
    });
  },
}));
