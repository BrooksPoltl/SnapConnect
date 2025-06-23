/**
 * Firebase error type definitions for SnapConnect
 * Provides type safety for Firebase Auth and Firestore errors
 */

import { FirebaseError } from 'firebase/app';

/**
 * Firebase Auth error codes
 * Based on Firebase Auth documentation
 */
export type FirebaseAuthErrorCode =
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'
  | 'auth/operation-not-allowed'
  | 'auth/invalid-credential'
  | 'auth/account-exists-with-different-credential'
  | 'auth/requires-recent-login'
  | 'auth/unknown-error';

/**
 * Firebase Firestore error codes
 * Based on Firebase Firestore documentation
 */
export type FirebaseFirestoreErrorCode =
  | 'firestore/cancelled'
  | 'firestore/unknown'
  | 'firestore/invalid-argument'
  | 'firestore/deadline-exceeded'
  | 'firestore/not-found'
  | 'firestore/already-exists'
  | 'firestore/permission-denied'
  | 'firestore/resource-exhausted'
  | 'firestore/failed-precondition'
  | 'firestore/aborted'
  | 'firestore/out-of-range'
  | 'firestore/unimplemented'
  | 'firestore/internal'
  | 'firestore/unavailable'
  | 'firestore/data-loss'
  | 'firestore/unauthenticated';

/**
 * Combined Firebase error codes
 */
export type FirebaseErrorCode = FirebaseAuthErrorCode | FirebaseFirestoreErrorCode;

/**
 * Firebase Auth Error interface extending FirebaseError
 */
export interface FirebaseAuthError extends FirebaseError {
  code: FirebaseAuthErrorCode;
  message: string;
  customData?: {
    email?: string;
    credential?: unknown;
  };
}

/**
 * Firebase Firestore Error interface extending FirebaseError
 */
export interface FirebaseFirestoreError extends FirebaseError {
  code: FirebaseFirestoreErrorCode;
  message: string;
}

/**
 * Generic Firebase Error type
 */
export type AppFirebaseError = FirebaseAuthError | FirebaseFirestoreError;

/**
 * Type guard to check if error is a Firebase error
 */
export const isFirebaseError = (error: unknown): error is FirebaseError =>
  error instanceof Error &&
  'code' in error &&
  typeof (error as Error & { code: unknown }).code === 'string';

/**
 * Type guard to check if error is a Firebase Auth error
 */
export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError =>
  isFirebaseError(error) && error.code.startsWith('auth/');

/**
 * Type guard to check if error is a Firebase Firestore error
 */
export const isFirebaseFirestoreError = (error: unknown): error is FirebaseFirestoreError =>
  isFirebaseError(error) && error.code.startsWith('firestore/');

/**
 * Error handling utility for Firebase operations
 */
export interface FirebaseErrorHandler {
  /**
   * Converts Firebase error to user-friendly message
   */
  getErrorMessage(error: FirebaseError): string;

  /**
   * Logs error with appropriate level
   */
  logError(error: FirebaseError, context?: string): void;
}
