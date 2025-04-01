import { Navigate } from 'react-router';
import { useUser } from '$hooks/useUser.ts';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <view className="w-full h-full flex items-center justify-center">
        <text className="text-gray-600">Loading...</text>
      </view>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}
