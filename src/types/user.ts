export interface User {
  id: string;
  email: string;
  username: string;
  score: number;
  has_completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserData {
  id?: string;
  email?: string;
  username: string;
  score: number;
  has_completed_onboarding?: boolean;
  created_at?: string;
  updated_at?: string;
}
