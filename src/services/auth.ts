/**
 * Authentication service using Supabase Auth
 * Following official Supabase patterns for React Native
 */
import { supabase } from './supabase';
import { AuthError, LoginCredentials, SignUpCredentials } from '../types/auth';
import { logger } from '../utils/logger';
import type { User } from '@supabase/supabase-js';

/**
 * Signs in a user with email and password
 * @param credentials - User's login credentials
 * @returns User object or throws error
 */
export const signIn = async (credentials: LoginCredentials): Promise<User> => {
  try {
    logger.info('Auth', 'Attempting to sign in user');
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from sign in');

    logger.info('Auth', 'User signed in successfully');
    return data.user;
  } catch (error: unknown) {
    logger.error('Auth', 'Error signing in user', error);
    const authError: AuthError = {
      code: 'auth/sign-in-failed',
      message: error instanceof Error ? error.message : 'Failed to sign in. Please try again.',
    };
    throw authError;
  }
};

/**
 * Creates a new user account with email and password
 * @param credentials - User's signup credentials
 * @returns User object or throws error
 */
export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  try {
    logger.info('Auth', 'Attempting to create new user account');
    const { email, password, name, username } = credentials;
    
    // First, check if username is available before creating auth user
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingProfile) {
      throw new Error('Username is already taken. Please choose a different username.');
    }
    
    // Create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from sign up');

    logger.info('Auth', 'User account created successfully');

    // Use Supabase RPC function to create profile atomically
    // This ensures the profile is created or the transaction fails
    logger.info('Auth', 'Creating user profile');
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      user_id: data.user.id,
      user_username: username,
      user_score: 0
    });

    if (profileError) {
      logger.error('Auth', 'Error creating user profile', profileError);
      
      // If profile creation fails, we should clean up the auth user
      // However, Supabase doesn't allow us to delete auth users from client
      // The user will need to be handled by the admin or the profile created later
      throw new Error('Failed to create user profile. Please try again or contact support.');
    }

    logger.info('Auth', 'User profile created successfully');
    return data.user;
  } catch (error: unknown) {
    logger.error('Auth', 'Error creating user account', error);
    const authError: AuthError = {
      code: 'auth/sign-up-failed',
      message:
        error instanceof Error ? error.message : 'Failed to create account. Please try again.',
    };
    throw authError;
  }
};

/**
 * Signs out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    logger.info('Auth', 'Attempting to sign out user');
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    logger.info('Auth', 'User signed out successfully');
  } catch (error: unknown) {
    logger.error('Auth', 'Error signing out user', error);
    const authError: AuthError = {
      code: 'auth/sign-out-failed',
      message: 'Failed to sign out. Please try again.',
    };
    throw authError;
  }
};
