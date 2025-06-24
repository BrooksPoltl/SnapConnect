import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';

import { getUserData } from '../../services/firestore';
import { AuthenticationResult } from '../../types/auth';
import { UserData } from '../../types/user';
import { logError } from '../logger';

/**
 * Custom hook for authentication state management
 * @returns Authentication state including user, userData, loading, and error
 */
export function useAuthentication(): AuthenticationResult {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, async (user: FirebaseAuthTypes.User | null) => {
      try {
        setError(null);

        if (user) {
          // User is signed in
          setUser(user);

          try {
            // Fetch user data from Firestore using service layer
            const fetchedUserData = await getUserData(user.uid);
            setUserData(fetchedUserData);
          } catch (firestoreError) {
            logError('useAuthentication', 'Error fetching user data', firestoreError);
            setError('Failed to load user profile');
            // Still set user even if userData fails to load
          }
        } else {
          // User is signed out
          setUser(null);
          setUserData(null);
        }
      } catch (authError) {
        logError('useAuthentication', 'Authentication error', authError);
        setError('Authentication failed');
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  return {
    user,
    userData,
    loading,
    error,
  };
}
