import { Helmet } from 'react-helmet-async';
import OTPVerification from 'src/sections/auth/jwt/otp-view';
// sections

// ----------------------------------------------------------------------

export default function onboardPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: OTP</title>
      </Helmet>

      <OTPVerification />
    </>
  );
}
