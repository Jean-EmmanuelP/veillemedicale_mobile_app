import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router';
import { AuthPage } from '$screens/Auth/AuthPage.tsx';
import { Feed } from '$screens/Feed/Feed.tsx';
import { Search } from '$screens/Search/Search.tsx';
import { Notifications } from '$screens/Notifications/Notifications.tsx';
import { Profile } from '$screens/Profile/Profile.tsx';
import { ProtectedRoute } from '$components/ProtectedRoute/ProtectedRoute.tsx';
import { MainLayout } from '$layouts/MainLayout.tsx';
import { Paywall } from '$components/Paywall/Paywall.tsx';
import { usePaywall } from '$hooks/usePaywall.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUser } from '$hooks/useUser.ts';

export function App() {
  const { isOpen, close } = usePaywall();
  const queryClient = useQueryClient();
  const user = useUser();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      nav('/');
    } else {
    nav('/auth');
    }
  }, [user, nav, location]);

  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Feed />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Search />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isOpen && (
        <Paywall
          onClose={close}
          onSubscribeSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
          }}
        />
      )}
    </>
  );
}
