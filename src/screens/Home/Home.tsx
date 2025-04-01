import { useNavigate } from 'react-router';
import { useUser } from '$hooks/useUser.ts';
import { useQueryClient } from '@tanstack/react-query';
import { AuthService } from '$api/auth.ts';
import { useState } from 'react';
import './Home.css';
import { useAuthToken } from '$hooks/useAuthToken.ts';
import { useCheckPremiumAccess } from '$hooks/useCheckPremiumAccess.ts';
import { Feed } from '$components/HomeViews/Feed.tsx';
import { Create } from '$components/HomeViews/Create.tsx';
import { Chat } from '$components/HomeViews/Chat.tsx';
import { Profile } from '$components/HomeViews/Profile.tsx';
import { TabBar } from '$components/TabBar/TabBar.tsx';

export default function Home() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();
  const { clearToken } = useAuthToken();
  const { checkAccess } = useCheckPremiumAccess();
  const [showCache, setShowCache] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  if (isLoading) {
    return (
      <view class="loading-container">
        <text class="loading-text">Chargement...</text>
      </view>
    );
  }

  if (!user) {
    nav('/auth');
    return null;
  }

  const handlePremiumClick = () => {
    if (checkAccess()) {
      nav('/premium');
    }
  };

  const handleSignOut = () => {
    AuthService.signOut();
    clearToken();
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const handleInspectCache = () => {
    setShowCache(!showCache);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'create':
        return <Create />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <view class="home-container">
      <view class="content-area">{renderContent()}</view>

      <TabBar />
    </view>
  );
}
