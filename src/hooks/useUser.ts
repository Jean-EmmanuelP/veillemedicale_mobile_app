import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from './useAuthToken.ts';
import type { User } from '$types/auth.ts';
import { supabaseFetch } from '../utils/supabaseFetch.ts';

const USER_QUERY_KEY = ['user'] as const;

export function useUser() {
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      if (!token) return null;
      try {
        // La réponse de Supabase contient directement les données utilisateur
        const userData = await supabaseFetch<User>('auth/v1/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('User data from Supabase:', userData);

        if (!userData) {
          console.error('No user data received from Supabase');
          return null;
        }

        return userData;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
    gcTime: 0,
  });
}

// Fonction helper pour mettre à jour l'utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return (user: User | null) => {
    queryClient.setQueryData(['user'], user);
  };
}
