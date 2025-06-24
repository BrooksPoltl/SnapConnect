import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { getUserData } from '../../services/database';
import { AuthenticationResult } from '../../types/auth';
import { UserData } from '../../types/user';
import { logError } from '../logger';
import type { User } from '@supabase/supabase-js';

/**
 * Custom hook for authentication state management using Supabase
 * @returns Authentication state including user, userData, loading, and error
 */
export function useAuthentication(): AuthenticationResult {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user data from Supabase using service layer
      const fetchedUserData = await getUserData(userId);
      setUserData(fetchedUserData);
    } catch (databaseError) {
      logError('useAuthentication', 'Error fetching user data', databaseError);
      setError('Failed to load user profile');
      // Still set user even if userData fails to load
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setError(null);
        setUser(session?.user ?? null);

        if (session?.user) {
          // User is signed in
          await fetchUserData(session.user.id);
        } else {
          // User is signed out
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userData,
    loading,
    error,
  };
}
