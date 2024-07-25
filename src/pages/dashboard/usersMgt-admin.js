import { Helmet } from 'react-helmet-async';
import UserMgtView from 'src/sections/UsersMgt/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>User Management</title>
      </Helmet>

      <UserMgtView />
    </>
  );
}
