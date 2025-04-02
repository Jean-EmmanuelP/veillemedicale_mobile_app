import { useEffect, useState } from '@lynx-js/react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabaseFetch } from '../../utils/supabaseFetch.ts';
import { useAuthToken } from '../../hooks/useAuthToken.ts';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    isSubscribed: boolean;
  };
}

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint = mode === 'signin' ? 'auth/signin' : 'auth/signup';
      const response = await supabaseFetch<AuthResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setToken(response.token);
      queryClient.setQueryData(['user'], response.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <view style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* Logo ou Titre */}
      <text style={{
        fontSize: "32px",
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: "48px",
        textAlign: "center"
      }}>
        Veille Médicale
      </text>

      {/* Tabs de sélection */}
      <view style={{
        display: "flex",
        backgroundColor: "#1f2937",
        borderRadius: "12px",
        padding: "4px",
        marginBottom: "32px"
      }}>
        <view
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: mode === 'signin' ? "#3b82f6" : "transparent",
            transition: "background-color 0.3s"
          }}
          bindtap={() => setMode('signin')}
        >
          <text style={{
            color: mode === 'signin' ? "#ffffff" : "#9ca3af",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Connexion
          </text>
        </view>
        <view
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            backgroundColor: mode === 'signup' ? "#3b82f6" : "transparent",
            transition: "background-color 0.3s"
          }}
          bindtap={() => setMode('signup')}
        >
          <text style={{
            color: mode === 'signup' ? "#ffffff" : "#9ca3af",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            Inscription
          </text>
        </view>
      </view>

      {/* Formulaire */}
      <view style={{
        width: "100%",
        maxWidth: "400px"
      }}>
        <view style={{ marginBottom: "16px" }}>
          <text style={{
            color: "#9ca3af",
            fontSize: "14px",
            marginBottom: "8px"
          }}>
            Email
          </text>
          <view
            style={{
              width: "100%",
              backgroundColor: "#1f2937",
              border: "2px solid #374151",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            <input
              // @ts-ignore
              bindinput={(e: any) => setEmail(e.detail.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: "#ffffff",
                fontSize: "16px",
                outline: "none",
                border: "none"
              }}
              placeholder="Entrez votre email"
              value={email}
            />
          </view>
        </view>

        <view style={{ marginBottom: "24px" }}>
          <text style={{
            color: "#9ca3af",
            fontSize: "14px",
            marginBottom: "8px"
          }}>
            Mot de passe
          </text>
          <view
            style={{
              width: "100%",
              backgroundColor: "#1f2937",
              border: "2px solid #374151",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            <input
              // @ts-ignore
              bindinput={(e: any) => setPassword(e.detail.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: "#ffffff",
                fontSize: "16px",
                outline: "none",
                border: "none"
              }}
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
            />
          </view>
        </view>

        {error && (
          <text style={{
            color: "#ef4444",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
            display: "block"
          }}>
            {error}
          </text>
        )}

        <view
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: loading ? "0.7" : "1",
            transition: "opacity 0.3s"
          }}
          bindtap={!loading ? handleSubmit : undefined}
        >
          <text style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "500"
          }}>
            {loading ? "Chargement..." : mode === 'signin' ? "Se connecter" : "S'inscrire"}
          </text>
        </view>

        {mode === 'signin' && (
          <text
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              marginTop: "16px",
              textAlign: "center",
              display: "block"
            }}
            bindtap={() => setMode('signup')}
          >
            Pas encore de compte ? Inscrivez-vous
          </text>
        )}
      </view>
    </view>
  );
}
