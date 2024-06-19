import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import ProfileClassicLayout from 'src/layouts/profile/classic';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

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
