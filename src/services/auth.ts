import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

import { auth } from '../../firebase';
import { AuthError, LoginCredentials, SignUpCredentials } from '../types/auth';
import { isFirebaseAuthError, FirebaseAuthErrorCode } from '../types/firebase';

/**
 * Signs in a user with email and password
 * @param credentials - User's login credentials
 * @returns User object or throws error
 */
export const signIn = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    if (isFirebaseAuthError(error)) {
      const authError: AuthError = {
        code: error.code,
        message: getFriendlyErrorMessage(error.code),
      };
      throw authError;
    } else {
      const authError: AuthError = {
        code: 'auth/unknown-error',
        message: 'An unexpected error occurred. Please try again.',
      };
      throw authError;
    }
  }
};

/**
 * Creates a new user account with email and password
 * @param credentials - User's signup credentials
 * @returns User object or throws error
 */
export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  try {
    const { email, password } = credentials;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    if (isFirebaseAuthError(error)) {
      const authError: AuthError = {
        code: error.code,
        message: getFriendlyErrorMessage(error.code),
      };
      throw authError;
    } else {
      const authError: AuthError = {
        code: 'auth/unknown-error',
        message: 'An unexpected error occurred. Please try again.',
      };
      throw authError;
    }
  }
};

/**
 * Signs out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    if (isFirebaseAuthError(error)) {
      const authError: AuthError = {
        code: error.code,
        message: 'Failed to sign out. Please try again.',
      };
      throw authError;
    } else {
      const authError: AuthError = {
        code: 'auth/unknown-error',
        message: 'Failed to sign out. Please try again.',
      };
      throw authError;
    }
  }
};

/**
 * Converts Firebase error codes to user-friendly messages
 * @param errorCode - Firebase error code
 * @returns User-friendly error message
 */
const getFriendlyErrorMessage = (errorCode: FirebaseAuthErrorCode): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
