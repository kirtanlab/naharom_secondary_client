import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
import ProfileClassicLayout from 'src/layouts/profile/classic';

// ----------------------------------------------------------------------

const UserForm = lazy(() => import('src/pages/profile/userprofile'));
const CompanyForm = lazy(() => import('src/pages/profile/companyprofile'));

// ----------------------------------------------------------------------

export const profileRoutes = [
  {
    path: 'profile',
    element: (
      <AuthGuard>
        <ProfileClassicLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </ProfileClassicLayout>
      </AuthGuard>
    ),
    children: [
      { path: 'user', element: <UserForm /> },
      { path: 'company', element: <CompanyForm /> },
    ],
  },
];
