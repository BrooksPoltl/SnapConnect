/**
 * Friends service using Supabase PostgreSQL
 * Handles all friendship and friend request operations
 * Following official Supabase patterns for React Native
 */
import { supabase } from './supabase';
import { logger } from '../utils/logger';

export interface FriendRequest {
  id: number;
  user_id_1: string;
  user_id_2: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  requester?: {
    id: string;
    username: string;
    score: number;
  };
  recipient?: {
    id: string;
    username: string;
    score: number;
  };
}

export interface Friend {
  id: string;
  username: string;
  score: number;
}

export interface Friendship {
  user_id_1: string;
  user_id_2: string;
  friend1: Friend;
  friend2: Friend;
}

/**
 * Sends a friend request to another user
 * @param recipientId - The ID of the user to send the request to
 */
export const sendFriendRequest = async (recipientId: string): Promise<void> => {
  try {
    logger.info('FriendsService', `Sending friend request to user: ${recipientId}`);

    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase.from('friendships').insert({
      user_id_1: currentUserId,
      user_id_2: recipientId,
      status: 'pending',
    });

    if (error) throw error;

    logger.info('FriendsService', 'Friend request sent successfully');
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error sending friend request', error);
    throw new Error(
      `Failed to send friend request: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets all incoming friend requests for the current user
 * @returns Array of pending friend requests
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    logger.info('FriendsService', 'Fetching incoming friend requests');

    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('friendships')
      .select(
        `
        id,
        user_id_1,
        user_id_2,
        status,
        created_at,
        updated_at,
        requester:profiles!friendships_user_id_1_fkey(id, username, score)
      `,
      )
      .eq('user_id_2', currentUserId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logger.info('FriendsService', `Found ${data.length} pending friend requests`);
    return data as unknown as FriendRequest[];
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error fetching friend requests', error);
    throw new Error(
      `Failed to fetch friend requests: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Accepts a friend request using secure backend function
 * @param requestId - The ID of the friend request to accept
 */
export const acceptFriendRequest = async (requestId: number): Promise<void> => {
  try {
    logger.info('FriendsService', `Accepting friend request: ${requestId}`);

    const { error } = await supabase.rpc('accept_friend_request', {
      request_id: requestId,
    });

    if (error) throw error;

    logger.info('FriendsService', 'Friend request accepted successfully');
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error accepting friend request', error);
    throw new Error(
      `Failed to accept friend request: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Declines a friend request using secure backend function
 * @param requestId - The ID of the friend request to decline
 */
export const declineFriendRequest = async (requestId: number): Promise<void> => {
  try {
    logger.info('FriendsService', `Declining friend request: ${requestId}`);

    const { error } = await supabase.rpc('decline_friend_request', {
      request_id: requestId,
    });

    if (error) throw error;

    logger.info('FriendsService', 'Friend request declined successfully');
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error declining friend request', error);
    throw new Error(
      `Failed to decline friend request: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets the current user's friends list
 * @returns Array of accepted friends
 */
export const getFriendsList = async (): Promise<Friend[]> => {
  try {
    logger.info('FriendsService', 'Fetching friends list');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('friendships')
      .select(
        `
        friendship_id:id,
        friend_a:profiles!user_id_1(id, username, score),
        friend_b:profiles!user_id_2(id, username, score)
      `,
      )
      .eq('status', 'accepted')
      .or(`user_id_1.eq.${currentUserId},user_id_2.eq.${currentUserId}`);

    if (error) throw error;

    // Transform the data to return the friend (not the current user)
    const friends: Friend[] = (
      data as unknown as {
        friendship_id: number;
        friend_a: Friend;
        friend_b: Friend;
      }[]
    )
      .map(({ friend_a, friend_b }) => {
        // Determine which object is the friend
        const friend = friend_a.id === currentUserId ? friend_b : friend_a;
        return friend;
      })
      .filter(friend => friend.id !== currentUserId); // Ensure we don't include ourselves

    logger.info('FriendsService', `Found ${friends.length} friends`);
    return friends;
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error fetching friends list', error);
    throw new Error(
      `Failed to fetch friends list: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Removes a friend (deletes the friendship record)
 * @param friendId - The ID of the friend to remove
 */
export const removeFriend = async (friendId: string): Promise<void> => {
  try {
    logger.info('FriendsService', `Removing friend: ${friendId}`);

    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(
        `and(user_id_1.eq.${currentUserId},user_id_2.eq.${friendId}),and(user_id_1.eq.${friendId},user_id_2.eq.${currentUserId})`,
      )
      .eq('status', 'accepted');

    if (error) throw error;

    logger.info('FriendsService', 'Friend removed successfully');
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error removing friend', error);
    throw new Error(
      `Failed to remove friend: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Gets suggested users to add as friends
 * @param limit - Maximum number of suggestions to return
 * @returns Array of suggested users
 */
export const getSuggestedFriends = async (limit: number = 10): Promise<Friend[]> => {
  try {
    logger.info('FriendsService', `Fetching ${limit} suggested friends`);

    const { data, error } = await supabase.rpc('get_suggested_friends', {
      limit_count: limit,
    });

    if (error) throw error;

    logger.info('FriendsService', `Found ${data.length} suggested friends`);
    return data as Friend[];
  } catch (error: unknown) {
    logger.error('FriendsService', 'Error fetching suggested friends', error);
    throw new Error(
      `Failed to fetch suggested friends: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
