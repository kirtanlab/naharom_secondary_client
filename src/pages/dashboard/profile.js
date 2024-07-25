import { Helmet } from 'react-helmet-async';
import ProfileView from 'src/sections/ProfilePage/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <ProfileView />
    </>
  );
}
