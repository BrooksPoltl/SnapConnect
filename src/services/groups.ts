/**
 * Groups service using Supabase PostgreSQL
 * Handles all group chat operations including creation, messaging, and member management
 * Following official Supabase patterns for React Native
 */
import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type {
  Group,
  GroupMember,
  GroupMessage,
  CreateGroupRequest,
  GroupDetails,
} from '../types/groups';

/**
 * Creates a new group with the specified name and initial members
 * @param request - Group creation request with name and member IDs
 * @returns The ID of the newly created group
 */
export const createGroup = async (request: CreateGroupRequest): Promise<number> => {
  try {
    logger.info(
      'GroupsService',
      `Creating group: ${request.name} with ${request.memberIds.length} members`,
    );

    const { data, error } = await supabase.rpc('create_group', {
      p_group_name: request.name,
      p_member_ids: request.memberIds,
    });

    if (error) throw error;

    logger.info('GroupsService', `Group created successfully with ID: ${data}`);
    return data as number;
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error creating group', error);
    throw new Error(
      `Failed to create group: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets all groups for the current user with last message and unread count
 * @returns Array of user's groups
 */
export const getUserGroups = async (): Promise<Group[]> => {
  try {
    logger.info('GroupsService', 'Fetching user groups');

    const { data, error } = await supabase.rpc('get_user_groups');

    if (error) throw error;

    logger.info('GroupsService', `Found ${data.length} groups`);
    return data as Group[];
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error fetching user groups', error);
    throw new Error(
      `Failed to fetch groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Sends a text message to a group
 * @param groupId - The ID of the group to send the message to
 * @param content - The text content of the message
 * @returns The ID of the sent message
 */
export const sendGroupMessage = async (groupId: number, content: string): Promise<number> => {
  try {
    logger.info('GroupsService', `Sending message to group ${groupId}`);

    const { data, error } = await supabase.rpc('send_group_message', {
      p_group_id: groupId,
      p_content_text: content,
    });

    if (error) throw error;

    logger.info('GroupsService', `Message sent successfully with ID: ${data}`);
    return data as number;
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error sending group message', error);
    throw new Error(
      `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets messages for a specific group
 * @param groupId - The ID of the group
 * @param limit - Maximum number of messages to return (default: 50)
 * @returns Array of group messages
 */
export const getGroupMessages = async (
  groupId: number,
  limit: number = 50,
): Promise<GroupMessage[]> => {
  try {
    logger.info('GroupsService', `Fetching messages for group ${groupId}`);

    const { data, error } = await supabase.rpc('get_group_messages', {
      p_group_id: groupId,
      p_limit: limit,
    });

    if (error) throw error;

    logger.info('GroupsService', `Found ${data.length} messages`);
    return data as GroupMessage[];
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error fetching group messages', error);
    throw new Error(
      `Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets detailed information about a group including its members
 * @param groupId - The ID of the group
 * @returns Group details with member list
 */
export const getGroupDetails = async (groupId: number): Promise<GroupDetails> => {
  try {
    logger.info('GroupsService', `Fetching details for group ${groupId}`);

    // Get group basic info
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('id, name, creator_id, created_at, updated_at')
      .eq('id', groupId)
      .single();

    if (groupError) throw groupError;

    // Get group members with their profile data
    const { data: membersData, error: membersError } = await supabase
      .from('group_members')
      .select(
        `
        group_id,
        user_id,
        joined_at,
        profiles(username, score)
      `,
      )
      .eq('group_id', groupId);

    if (membersError) throw membersError;

    // Transform members data - profiles is returned as an array from the join
    interface MemberDataFromSupabase {
      group_id: number;
      user_id: string;
      joined_at: string;
      profiles: {
        username: string;
        score: number;
      };
    }

    const members: GroupMember[] = (membersData as unknown as MemberDataFromSupabase[]).map(
      member => ({
        group_id: member.group_id,
        user_id: member.user_id,
        username: member.profiles?.username ?? '',
        score: member.profiles?.score ?? 0,
        joined_at: member.joined_at,
      }),
    );

    const groupDetails: GroupDetails = {
      id: groupData.id,
      name: groupData.name,
      creator_id: groupData.creator_id,
      created_at: groupData.created_at,
      updated_at: groupData.updated_at,
      members,
    };

    logger.info('GroupsService', `Group details fetched successfully for group ${groupId}`);
    return groupDetails;
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error fetching group details', error);
    throw new Error(
      `Failed to fetch group details: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Adds new members to an existing group
 * @param groupId - The ID of the group
 * @param memberIds - Array of user IDs to add to the group
 */
export const addGroupMembers = async (groupId: number, memberIds: string[]): Promise<void> => {
  try {
    logger.info('GroupsService', `Adding ${memberIds.length} members to group ${groupId}`);

    const { error } = await supabase.rpc('add_group_members', {
      p_group_id: groupId,
      p_member_ids: memberIds,
    });

    if (error) throw error;

    logger.info('GroupsService', 'Members added successfully');
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error adding group members', error);
    throw new Error(
      `Failed to add members: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Leaves a group (removes current user from group membership)
 * @param groupId - The ID of the group to leave
 */
export const leaveGroup = async (groupId: number): Promise<void> => {
  try {
    logger.info('GroupsService', `Leaving group ${groupId}`);

    const { error } = await supabase.rpc('leave_group', {
      p_group_id: groupId,
    });

    if (error) throw error;

    logger.info('GroupsService', 'Successfully left group');
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error leaving group', error);
    throw new Error(
      `Failed to leave group: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Marks all messages in a group as read by the current user
 * @param groupId - The ID of the group
 */
export const markGroupMessagesAsRead = async (groupId: number): Promise<void> => {
  try {
    logger.info('GroupsService', `Marking messages as read for group ${groupId}`);

    const { error } = await supabase.rpc('mark_group_messages_as_read', {
      p_group_id: groupId,
    });

    if (error) throw error;

    logger.info('GroupsService', 'Messages marked as read successfully');
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error marking messages as read', error);
    throw new Error(
      `Failed to mark messages as read: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Searches for users to add to a group (searches all platform users)
 * @param query - Search query string
 * @param limit - Maximum number of results to return
 * @returns Array of users matching the search query
 */
export const searchUsersForGroup = async (
  query: string,
  limit: number = 20,
): Promise<GroupMember[]> => {
  try {
    logger.info('GroupsService', `Searching users with query: ${query}`);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, score')
      .ilike('username', `%${query}%`)
      .limit(limit);

    if (error) throw error;

    // Transform to GroupMember format (without group_id and joined_at for search results)
    const users: GroupMember[] = data.map(user => ({
      group_id: 0, // Not applicable for search results
      user_id: user.id,
      username: user.username,
      score: user.score,
      joined_at: '', // Not applicable for search results
    }));

    logger.info('GroupsService', `Found ${users.length} users`);
    return users;
  } catch (error: unknown) {
    logger.error('GroupsService', 'Error searching users', error);
    throw new Error(
      `Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Subscribes to real-time group message updates
 * @param groupId - The ID of the group to subscribe to
 * @param callback - Function to call when new messages arrive
 * @returns Subscription object that can be used to unsubscribe
 */
export const subscribeToGroupMessages = (
  groupId: number,
  callback: (message: GroupMessage) => void,
) => {
  logger.info('GroupsService', `Subscribing to real-time messages for group ${groupId}`);

  return supabase
    .channel(`group_messages_${groupId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`,
      },
      async payload => {
        logger.info('GroupsService', 'Received real-time group message', payload);

        try {
          // Get current user to determine if this is own message
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const currentUserId = user?.id;

          // Get sender profile for username
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.sender_id)
            .single();

          // Transform the payload to match our GroupMessage interface
          const message: GroupMessage = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            sender_username: senderProfile?.username ?? 'Unknown User',
            content_type: payload.new.content_type,
            content_text: payload.new.content_text,
            storage_path: payload.new.storage_path,
            created_at: payload.new.created_at,
            viewed_at: payload.new.viewed_at,
            is_own_message: payload.new.sender_id === currentUserId,
          };

          callback(message);
        } catch (error) {
          logger.error('GroupsService', 'Error processing real-time message', error);

          // Fallback: still send the message but with basic info
          const message: GroupMessage = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            sender_username: 'Unknown User',
            content_type: payload.new.content_type,
            content_text: payload.new.content_text,
            storage_path: payload.new.storage_path,
            created_at: payload.new.created_at,
            viewed_at: payload.new.viewed_at,
            is_own_message: false,
          };

          callback(message);
        }
      },
    )
    .subscribe();
};
