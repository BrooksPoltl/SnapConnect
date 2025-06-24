import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Initialize Firebase
/**
 * The primary Firebase authentication instance.
 */
export const firebaseAuth = auth();

/**
 * The primary Firebase Firestore database instance.
 */
export const firestoreDb = firestore();

/**
 * The primary Firebase Storage instance.
 */
export const firebaseStorage = storage();
