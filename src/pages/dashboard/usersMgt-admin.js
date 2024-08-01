import { Helmet } from 'react-helmet-async';
import { useAuthContext } from 'src/auth/hooks';
import UserMgtView from 'src/sections/UsersMgt/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title>User Management</title>
      </Helmet>

      <UserMgtView />
    </>
  );
}
