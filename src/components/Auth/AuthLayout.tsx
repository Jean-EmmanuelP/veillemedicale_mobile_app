// AuthLayout.tsx
import LynxLogo from '$assets/lynx-logo.png';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <view className="auth-layout">
      <view className="auth-card">
        <img src={LynxLogo} alt="Lynx Logo" className="logo" />
        {children}
      </view>
    </view>
  );
}

// Divider.tsx
export function Divider({ children }: { children?: string }) {
  return (
    <view class="divider">
      <view class="divider-line" />
      {children && <text class="divider-text">{children}</text>}
      <view class="divider-line" />
    </view>
  );
}

// ToggleMode.tsx
export function ToggleMode({ children }: { children: React.ReactNode }) {
  return <view class="toggle-mode">{children}</view>;
}

export function OAuthButtons({ onAuth }: { onAuth: (provider: OAuthProvider) => void }) {
  return (
    <view className="oauth-buttons">
      <button className="oauth-button google" onClick={() => onAuth('google')}> 
        <svg className="oauth-icon" viewBox="0 0 24 24">
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.835 0 3.456.777 4.607 2.017l3.031-2.923A9.963 9.963 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a9.994 9.994 0 00-.146-1.788l-9.854-.007z"/>
        </svg>
        Continue with Google
      </button>
      
      <button class="oauth-button apple" onClick={() => onAuth('apple')}>
        <svg class="oauth-icon" viewBox="0 0 24 24">
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17.31 2.93997 13.7 4.69997 10.78C5.56997 9.17 7.12997 8.16 8.81997 8.16C10.1 8.16 11.32 9.09 12.11 9.09C12.86 9.09 14.37 8.06 15.92 8.32C16.57 8.38 18.39 8.74 19.56 10.5C19.47 10.57 17.39 12.08 17.41 14.63C17.44 17.65 20.06 18.66 20.09 18.67C20.06 18.74 19.67 20.11 18.71 19.5ZM13 7.5C13.97 6.61 14.57 5.34 14.45 4C13.44 4.07 12.32 4.69 11.67 5.6C10.78 6.71 10.24 8.05 10.37 9.41C11.49 9.47 12.59 8.84 13 7.5Z"/>
        </svg>
        Continue with Apple
      </button>
    </view>
  );
}

import { useState } from 'react';
import type { Credentials, OAuthProvider } from '$types/auth.ts';

type AuthFormProps = {
  mode: 'signin' | 'signup';
  onSubmit: (credentials: Credentials) => void;
  error?: string;
};

export function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, ...(mode === 'signup' && { name }) });
  };

  return (
    <form class="auth-form" onSubmit={handleSubmit}>
      {error && <view class="auth-error">{error}</view>}
      
      {mode === 'signup' && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          class="auth-input"
        />
      )}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        class="auth-input"
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        class="auth-input"
      />
      
      <button type="submit" class="auth-submit">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}