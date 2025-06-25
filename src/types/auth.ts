import type { User } from '@supabase/supabase-js';
import { UserData } from './user';

export interface AuthenticationResult {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name: string;
  username: string;
  confirmPassword: string;
}
