export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  username?: string;
  password?: string;
  roles?: string[];
  nickname?: string;
  phone?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}
