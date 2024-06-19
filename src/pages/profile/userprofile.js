import { Helmet } from 'react-helmet-async';
import UserForm from 'src/sections/profile/user-profile';
// sections

// ----------------------------------------------------------------------

export default function UserProfile() {
  return (
    <>
      <Helmet>
        <title> User Profile</title>
      </Helmet>

      {/* <JwtRegisterView /> */}
      <UserForm />
    </>
  );
}
