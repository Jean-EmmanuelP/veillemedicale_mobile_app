import { useState } from 'react';
import type { Credentials } from '$types/auth.ts';
import '../AuthForm/AuthForm.css';

interface AuthFormProps {
  onSubmit: (credentials: Credentials) => void;
  buttonText: string;
}

export function AuthForm({ onSubmit, buttonText }: AuthFormProps) {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  });

  const handleInput = (e: any) => {
    setCredentials({
      ...credentials,
      [e.currentTarget.id]: e.detail.value,
    });
  };

  return (
    <view class="auth-form">
      <view class="input-group">
        <text class="input-label">Email</text>
        <view class="input-container">
          <input
            id="email"
            bindinput={handleInput}
            class="input-field"
            placeholder="john.doe@example.com"
          />
        </view>
      </view>
      <view class="input-group">
        <text class="input-label">Mot de passe</text>
        <view class="input-container">
          <input
            id="password"
            bindinput={handleInput}
            class="input-field"
            placeholder="********"
            type="password"
          />
        </view>
      </view>
      <view class="submit-button">
        <text bindtap={() => onSubmit(credentials)} class="submit-button-text">
          {buttonText}
        </text>
      </view>
    </view>
  );
}