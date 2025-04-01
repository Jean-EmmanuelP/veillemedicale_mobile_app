import { useLocation, useNavigate } from 'react-router';

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/feed', icon: '🏠', label: 'Feed' },
    { path: '/search', icon: '🔍', label: 'Recherche' },
    { path: '/notifications', icon: '🔔', label: 'Notifications' },
    { path: '/profile', icon: '👤', label: 'Profil' }
  ];

  return (
    <view className="w-full bg-white border-t border-gray-200 flex items-center justify-around py-2">
      {tabs.map(tab => (
        <view
          key={tab.path}
          className={`flex flex-col items-center p-2 cursor-pointer
            ${location.pathname === tab.path 
              ? 'text-blue-500' 
              : 'text-gray-500 hover:text-gray-700'}`}
          bindtap={() => navigate(tab.path)}
        >
          <text className="text-xl mb-1">{tab.icon}</text>
          <text className="text-xs">{tab.label}</text>
        </view>
      ))}
    </view>
  );
} 