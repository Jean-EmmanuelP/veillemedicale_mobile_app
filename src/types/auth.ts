export type AuthMethod = 'email' | 'google' | 'apple';
export type OAuthProvider = 'google' | 'apple' | 'x';

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  isSubscribed: boolean;
  authMethod: AuthMethod;
  createdAt: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
}