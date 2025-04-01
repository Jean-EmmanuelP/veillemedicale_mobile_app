import { useUser } from '$hooks/useUser.ts';
import './PremiumFeature.css';

export function PremiumFeature() {
  const { data: user, isLoading } = useUser();

  if (isLoading)
    return (
      <view class="loading-container">
        <text class="loading-text">Loading...</text>
      </view>
    );
  if (!user?.isSubscribed) return null;

  return (
    <view class="premium-feature-container">
      <text class="premium-title">Bienvenue dans la fonctionnalité Premium !</text>
      <text class="premium-message">Merci de votre abonnement, {user.first_name}.</text>
    </view>
  );
}