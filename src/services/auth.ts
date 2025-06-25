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

    // Profile will be created automatically by the database trigger (handle_new_user)
    // The trigger extracts username from user metadata and creates the profile
    logger.info('Auth', 'User profile will be created automatically by database trigger');
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
