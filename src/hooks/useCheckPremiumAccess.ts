import { useUser } from './useUser.ts';
import { usePaywall } from './usePaywall.ts';

export function useCheckPremiumAccess() {
  const { data: user } = useUser();
  const { open } = usePaywall();

  return {
    checkAccess: () => {
      if (!user?.isSubscribed) {
        open();
        return false;
      }
      return true;
    }
  };
} 