import { Helmet } from 'react-helmet-async';
import CompanyForm from 'src/sections/profile/company-profile';
import UserForm from 'src/sections/profile/user-profile';
// sections

// ----------------------------------------------------------------------

export default function UserProfile() {
  return (
    <>
      <Helmet>
        <title> Company Profile</title>
      </Helmet>

      <CompanyForm />
    </>
  );
}
