import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const Auction = lazy(() => import('src/pages/dashboard/auction-user'));
const ContractMgt = lazy(() => import('src/pages/dashboard/invoices-admin'));
const UsersMgt = lazy(() => import('src/pages/dashboard/usersMgt-admin'));
const Profile = lazy(() => import('src/pages/dashboard/profile'));
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'Auction', element: <Auction /> },
      { path: 'ContractMgt', element: <ContractMgt /> },
      { path: 'UsersMgt', element: <UsersMgt /> },
      { path: 'Profile', element: <Profile /> },
    ],
  },
];
