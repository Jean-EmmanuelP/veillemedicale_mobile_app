import { TabBar } from '$components/TabBar/TabBar.tsx';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <view className="w-full h-full flex flex-col bg-gray-50">
      <view className="flex-1 overflow-hidden">
        {children}
      </view>
      <TabBar />
    </view>
  );
} 