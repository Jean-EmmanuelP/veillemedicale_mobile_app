import { useEffect, useState } from '@lynx-js/react';
import { useNavigate } from 'react-router';
import { AuthService } from '$api/auth.ts';
import { useAuthToken } from '$hooks/useAuthToken.ts';
import type { Credentials } from '$types/auth.ts';
import { useQueryClient } from '@tanstack/react-query';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuthToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(email);
  }, [email]);

  const handleSubmit = async () => {
    try {
      const credentials: Credentials = { email, password };
      const authFn = mode === 'signin' 
        ? AuthService.signInWithEmail 
        : AuthService.signUpWithEmail;

      const { token, user } = await authFn(credentials);
      setToken(token);
      queryClient.setQueryData(['user'], user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <view className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <view className="w-full max-w-[400px] bg-white rounded-xl p-8 shadow-lg">
        <text className="text-4xl font-bold text-center mb-2">Grok</text>
        <text className="text-lg text-gray-600 text-center mb-8">Comprendre l'univers_</text>

        {error && (
          <view className="bg-red-50 p-3 rounded-lg mb-6">
            <text className="text-red-500 text-sm">{error}</text>
          </view>
        )}

        <view className="flex flex-col gap-4">
          <view className="flex flex-col gap-2">
            <text className="text-sm text-gray-600">Email</text>
            <input
              className="p-3 text-base border border-gray-200 rounded-lg outline-none"
              value={email}
              // @ts-ignore
              bindinput={(e) => setEmail((e.detail as HTMLInputElement).value)}
              placeholder="email@example.com"
              type="email"
              autoComplete="email"
            />
          </view>

          <view className="flex flex-col gap-2">
            <text className="text-sm text-gray-600">Mot de passe</text>
            <input
              className="p-3 text-base border border-gray-200 rounded-lg outline-none"
              value={password}
              // @ts-ignore
              bindinput={(e) => setPassword((e.detail as HTMLInputElement).value)}
              type="password"
              placeholder="••••••••"
            />
          </view>

          <view
            className="bg-blue-500 text-white p-3 rounded-lg text-center cursor-pointer mt-2"
            bindtap={handleSubmit}
          >
            <text className="text-base font-bold">
              {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
            </text>
          </view>

          <view className="flex justify-center gap-1 mt-4">
            <text className="text-sm text-gray-600">
              {mode === 'signin' ? "Pas encore de compte ? " : "Déjà un compte ? "}
            </text>
            <view
              className="text-sm text-blue-500 font-bold cursor-pointer"
              bindtap={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? "S'inscrire" : "Se connecter"}
            </view>
          </view>
        </view>

        <text className="text-xs text-gray-600 text-center mt-8">
          En continuant, vous acceptez les Conditions d'utilisation et la 
          Politique de confidentialité
        </text>
      </view>
    </view>
  );
}
