/**
 * User service using Supabase PostgreSQL
 * Handles all user profile related operations
 * Following official Supabase patterns for React Native
 */
import { supabase } from './supabase';
import { UserData } from '../types/user';
import { logger } from '../utils/logger';

/**
 * Fetches user data from Supabase
 * @param userId - User's unique identifier
 * @returns User data or null if not found
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    logger.info('User', `Getting user data for user: ${userId}`);

    // Get auth user data (email, etc.) - only accessible to the user themselves
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    // Get profile data (public info)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        logger.info('User', 'User profile not found');
        return null;
      }
      throw profileError;
    }

    if (!profile) return null;

    // Combine data - only include email if it's the current user
    const userData: UserData = {
      id: profile.id,
      username: profile.username,
      score: profile.score ?? 0,
      // Only include email for the current user
      ...(authData.user?.id === userId && { email: authData.user.email }),
    };

    logger.info('User', 'User data retrieved successfully');
    return userData;
  } catch (error: unknown) {
    logger.error('UserService', 'Error fetching user data', error);
    throw new Error(
      `Failed to fetch user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Fetches a user's public profile (username and score only)
 * @param userId - User's unique identifier
 * @returns Public profile data or null if not found
 */
export const getUserProfile = async (
  userId: string,
): Promise<{ username: string; score: number } | null> => {
  try {
    logger.info('UserService', `Fetching public profile for ID: ${userId}`);

    const { data, error } = await supabase
      .from('profiles')
      .select('username, score')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.info('UserService', 'User profile not found');
        return null;
      }
      throw error;
    }

    logger.info('UserService', 'User profile fetched successfully');
    return data;
  } catch (error: unknown) {
    logger.error('UserService', 'Error fetching user profile', error);
    throw new Error(
      `Failed to fetch user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Creates or updates user data in Supabase
 * @param userId - User's unique identifier
 * @param userData - User data to save
 */
export const saveUserData = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    logger.info('UserService', `Saving user data for ID: ${userId}`);

    // Extract only profile-related fields (exclude email and other auth fields)
    const { email: _email, ...profileData } = userData;

    const { error } = await supabase.from('profiles').upsert(
      {
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      },
    );

    if (error) throw error;

    logger.info('UserService', 'User data saved successfully');
  } catch (error: unknown) {
    logger.error('UserService', 'Error saving user data', error);
    throw new Error(
      `Failed to save user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Updates user data in Supabase
 * @param userId - User's unique identifier
 * @param updates - Partial user data to update
 */
export const updateUserData = async (userId: string, updates: Partial<UserData>): Promise<void> => {
  try {
    logger.info('UserService', `Updating user data for ID: ${userId}`);

    // Extract only profile-related fields (exclude email and other auth fields)
    const { email: _email, ...profileUpdates } = updates;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    logger.info('UserService', 'User data updated successfully');
  } catch (error: unknown) {
    logger.error('UserService', 'Error updating user data', error);
    throw new Error(
      `Failed to update user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Securely updates a user's username via backend function
 * This will call a Postgres function that enforces validation
 * @param newUsername - The new username to set
 */
export const updateUsername = async (newUsername: string): Promise<void> => {
  try {
    logger.info('UserService', 'Updating username via secure backend function');

    const { error } = await supabase.rpc('update_username', {
      new_username: newUsername,
    });

    if (error) throw error;

    logger.info('UserService', 'Username updated successfully');
  } catch (error: unknown) {
    logger.error('UserService', 'Error updating username', error);
    throw new Error(
      `Failed to update username: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Marks the current user as having completed the onboarding flow
 * This will call a secure Postgres function to update the flag
 */
export const markOnboardingComplete = async (): Promise<void> => {
  try {
    logger.info('UserService', 'Marking onboarding as complete');

    const { error } = await supabase.rpc('mark_onboarding_complete');

    if (error) throw error;

    logger.info('UserService', 'Onboarding marked as complete successfully');
  } catch (error: unknown) {
    logger.error('UserService', 'Error marking onboarding complete', error);
    throw new Error(
      `Failed to mark onboarding complete: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Deletes user data from Supabase
 * @param userId - User's unique identifier
 */
export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    logger.info('UserService', `Deleting user data for ID: ${userId}`);

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) throw error;

    logger.info('UserService', 'User data deleted successfully');
  } catch (error: unknown) {
    logger.error('UserService', 'Error deleting user data', error);
    throw new Error(
      `Failed to delete user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Fetches users with pagination from Supabase
 * @param pageSize - Number of users to fetch
 * @param offset - Number of records to skip for pagination
 * @returns Array of user data and pagination info
 */
export const getUsers = async (
  pageSize: number = 20,
  offset: number = 0,
): Promise<{ users: UserData[]; hasMore: boolean }> => {
  try {
    logger.info('UserService', `Fetching users with page size: ${pageSize}, offset: ${offset}`);

    // For listing users, we only need profile data (username, score)
    // Email is private and shouldn't be included in user lists
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, score, created_at, updated_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    // Convert to UserData format (without email for privacy)
    const users: UserData[] = data.map(profile => ({
      id: profile.id,
      email: '', // Don't expose email in user lists
      username: profile.username,
      score: profile.score,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }));

    const hasMore = users.length === pageSize;

    logger.info('UserService', `Fetched ${users.length} users successfully`);
    return { users, hasMore };
  } catch (error: unknown) {
    logger.error('UserService', 'Error fetching users', error);
    throw new Error(
      `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Search users by username
 * @param searchTerm - Username search term
 * @param limit - Maximum number of results
 * @returns Array of matching users
 */
export const searchUsers = async (searchTerm: string, limit: number = 10): Promise<UserData[]> => {
  try {
    logger.info('UserService', `Searching users with term: ${searchTerm}`);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, score, created_at, updated_at')
      .ilike('username', `%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;

    // Convert to UserData format (without email for privacy)
    const users: UserData[] = data.map(profile => ({
      id: profile.id,
      email: '', // Don't expose email in search results
      username: profile.username,
      score: profile.score,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }));

    logger.info('UserService', `Found ${users.length} matching users`);
    return users;
  } catch (error: unknown) {
    logger.error('UserService', 'Error searching users', error);
    throw new Error(
      `Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
