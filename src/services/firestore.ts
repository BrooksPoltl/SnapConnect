import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore';

import { db } from '../../firebase';
import { UserData } from '../types/user';
import { isFirebaseFirestoreError } from '../types/firebase';
import { logError } from '../utils/logger';

/**
 * Fetches user data from Firestore
 * @param userId - User's unique identifier
 * @returns User data or null if not found
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'Users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserData;
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
    const userDocRef = doc(db, 'Users', userId);
    const timestamp = new Date();

    const dataToSave = {
      ...userData,
      updatedAt: timestamp,
      createdAt: userData.createdAt ?? timestamp,
    };

    await setDoc(userDocRef, dataToSave, { merge: true });
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
    const userDocRef = doc(db, 'Users', userId);
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(userDocRef, updateData);
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
    const userDocRef = doc(db, 'Users', userId);
    await deleteDoc(userDocRef);
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
  lastDoc?: DocumentSnapshot,
): Promise<{ users: UserData[]; lastDoc: DocumentSnapshot | null }> => {
  try {
    let q = query(collection(db, 'Users'), orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const users: UserData[] = [];
    let lastDocument: DocumentSnapshot | null = null;

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
