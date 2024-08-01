import { Helmet } from 'react-helmet-async';
import UserForm from 'src/sections/profile-auth/user-profile';
// sections

// ----------------------------------------------------------------------

export default function UserProfile() {
  console.log('User Profile entered');
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
