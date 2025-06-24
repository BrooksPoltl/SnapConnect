/**
 * Database service using Supabase PostgreSQL
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
    logger.info('Database', `Fetching user data for ID: ${userId}`);

    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        logger.info('Database', 'User data not found');
        return null;
      }
      throw error;
    }

    logger.info('Database', 'User data fetched successfully');
    return data as UserData;
  } catch (error: unknown) {
    logger.error('Database', 'Error fetching user data', error);
    throw new Error(
      `Failed to fetch user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    logger.info('Database', `Saving user data for ID: ${userId}`);

    const { error } = await supabase.from('users').upsert(
      {
        id: userId,
        ...userData,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      },
    );

    if (error) throw error;

    logger.info('Database', 'User data saved successfully');
  } catch (error: unknown) {
    logger.error('Database', 'Error saving user data', error);
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
    logger.info('Database', `Updating user data for ID: ${userId}`);

    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    logger.info('Database', 'User data updated successfully');
  } catch (error: unknown) {
    logger.error('Database', 'Error updating user data', error);
    throw new Error(
      `Failed to update user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Deletes user data from Supabase
 * @param userId - User's unique identifier
 */
export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    logger.info('Database', `Deleting user data for ID: ${userId}`);

    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) throw error;

    logger.info('Database', 'User data deleted successfully');
  } catch (error: unknown) {
    logger.error('Database', 'Error deleting user data', error);
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
    logger.info('Database', `Fetching users with page size: ${pageSize}, offset: ${offset}`);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    const users = data as UserData[];
    const hasMore = users.length === pageSize;

    logger.info('Database', `Fetched ${users.length} users successfully`);
    return { users, hasMore };
  } catch (error: unknown) {
    logger.error('Database', 'Error fetching users', error);
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
    logger.info('Database', `Searching users with term: ${searchTerm}`);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', `%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;

    logger.info('Database', `Found ${data.length} matching users`);
    return data as UserData[];
  } catch (error: unknown) {
    logger.error('Database', 'Error searching users', error);
    throw new Error(
      `Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
