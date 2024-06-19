import { Helmet } from 'react-helmet-async';
// sections
import { JwtLoginView } from 'src/sections/auth/jwt';
import JwtOnboard from 'src/sections/auth/jwt/jwt-onboard-view';

// ----------------------------------------------------------------------

export default function onboardPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Onboard</title>
      </Helmet>

      <JwtOnboard />
    </>
  );
}
