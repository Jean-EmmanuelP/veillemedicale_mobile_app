import { useUser } from '$hooks/useUser.ts';
import { useAuthToken } from '$hooks/useAuthToken.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useCheckPremiumAccess } from '$hooks/useCheckPremiumAccess.ts';

export function Profile() {
  const { data: user } = useUser();
  const { clearToken } = useAuthToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { checkAccess } = useCheckPremiumAccess();

  const handleLogout = () => {
    clearToken();
    queryClient.clear();
    navigate('/auth');
  };

  const handleUpgradeClick = () => {
    checkAccess();
  };

  if (!user) return null;

  return (
    <view className="w-full h-full">
      <text className="text-2xl font-bold px-4 py-3">Profile</text>
      <view className="p-4 flex flex-col items-center">
        <image
          src={user.picture || ''}
          className="w-24 h-24 rounded-full mb-4"
        />
        <text className="text-xl font-bold text-gray-900">{user.name || 'Utilisateur'}</text>
        <text className="text-gray-500 mb-6">{user.email}</text>

        <view className="w-full max-w-sm bg-white rounded-lg shadow p-4 mb-4">
          <text className="text-gray-700 mb-2">
            Status: {user.isSubscribed ? 'Premium ✨' : 'Gratuit'}
          </text>
          {!user.isSubscribed && (
            <text 
              className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              bindtap={handleUpgradeClick}
            >
              Passer en Premium
            </text>
          )}
        </view>

        <text 
          className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          bindtap={handleLogout}
        >
          Se déconnecter
        </text>
      </view>
    </view>
  );
}
