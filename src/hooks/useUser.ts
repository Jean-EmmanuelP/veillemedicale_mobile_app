import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from './useAuthToken.ts';
import { UserService } from '$api/user.ts';
import type { User } from '$types/auth.ts';

const USER_QUERY_KEY = ['user'] as const;

export function useUser() {
  const { token } = useAuthToken();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => UserService.getCurrentUser(token),
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
