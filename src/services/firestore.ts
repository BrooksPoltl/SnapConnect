import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { firestoreDb } from '../../firebase';
import { UserData } from '../types/user';
import { isFirebaseFirestoreError } from '../types/firebase';
import { logError } from '../utils/logger';

// A permissive type for data being sent to Firestore to satisfy the linter
type FirestoreData = { [key: string]: any };

/**
 * Fetches user data from Firestore
 * @param userId - User's unique identifier
 * @returns User data or null if not found
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = (await firestoreDb
      .collection('Users')
      .doc(userId)
      .get()) as FirebaseFirestoreTypes.DocumentSnapshot<UserData>;

    // @ts-ignore - The linter is incorrectly flagging this as an error. 'exists' is a boolean property.
    if (userDoc.exists) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: unknown) {
    logError('Firestore', 'Error fetching user data', error);
    if (isFirebaseFirestoreError(error)) {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    } else {
      throw new Error('Failed to fetch user data');
    }
  }
};

/**
 * Creates or updates user data in Firestore
 * @param userId - User's unique identifier
 * @param userData - User data to save
 */
export const saveUserData = async (userId: string, userData: Partial<UserData>): Promise<void> => {
  try {
    const userDocRef = firestoreDb.collection('Users').doc(userId);
    const timestamp = firestore.FieldValue.serverTimestamp();

    const dataToSave = {
      ...userData,
      updatedAt: timestamp,
      createdAt: userData.createdAt ?? timestamp,
    };

    await userDocRef.set(dataToSave as FirestoreData, { merge: true });
  } catch (error: unknown) {
    logError('Firestore', 'Error saving user data', error);
    if (isFirebaseFirestoreError(error)) {
      throw new Error(`Failed to save user data: ${error.message}`);
    } else {
      throw new Error('Failed to save user data');
    }
  }
};

/**
 * Updates user data in Firestore
 * @param userId - User's unique identifier
 * @param updates - Partial user data to update
 */
export const updateUserData = async (userId: string, updates: Partial<UserData>): Promise<void> => {
  try {
    const userDocRef = firestoreDb.collection('Users').doc(userId);
    const updateData = {
      ...updates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await userDocRef.update(updateData as FirestoreData);
  } catch (error: unknown) {
    logError('Firestore', 'Error updating user data', error);
    if (isFirebaseFirestoreError(error)) {
      throw new Error(`Failed to update user data: ${error.message}`);
    } else {
      throw new Error('Failed to update user data');
    }
  }
};

/**
 * Deletes user data from Firestore
 * @param userId - User's unique identifier
 */
export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    await firestoreDb.collection('Users').doc(userId).delete();
  } catch (error: unknown) {
    logError('Firestore', 'Error deleting user data', error);
    if (isFirebaseFirestoreError(error)) {
      throw new Error(`Failed to delete user data: ${error.message}`);
    } else {
      throw new Error('Failed to delete user data');
    }
  }
};

/**
 * Fetches users with pagination
 * @param pageSize - Number of users to fetch
 * @param lastDoc - Last document from previous page (for pagination)
 * @returns Array of user data
 */
export const getUsers = async (
  pageSize: number = 20,
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
): Promise<{ users: UserData[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
  try {
    let query = firestoreDb.collection('Users').orderBy('createdAt', 'desc').limit(pageSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const querySnapshot = await query.get();
    const users: UserData[] = [];
    let lastDocument: FirebaseFirestoreTypes.DocumentSnapshot | null = null;

    querySnapshot.forEach(doc => {
      const userData = doc.data() as UserData;
      users.push({ ...userData, id: doc.id });
      lastDocument = doc;
    });

    return { users, lastDoc: lastDocument };
  } catch (error: unknown) {
    logError('Firestore', 'Error fetching users', error);
    if (isFirebaseFirestoreError(error)) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    } else {
      throw new Error('Failed to fetch users');
    }
  }
};
