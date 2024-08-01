import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.onboard,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const router = useRouter();

  const { authenticated, isKYC, isBank, method, user_role } = useAuthContext();
  // console.log('AuthGuard: ', isKYC, authenticated);
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else if (authenticated && !isKYC) {
      setChecked(true);
      if (user_role === 'Individual') {
        // console.log('entering individual');
        router.replace(paths.profile.user);
      } else {
        router.replace(paths.profile.company);
      }
    } else if (authenticated && isKYC) {
      router.replace(paths.dashboard.root);
      setChecked(true);
    }
    // } else if (authenticated && !isBank) {
    //   if (user_role === 'Individual') {
    //     router.replace(paths.profile.user);
    //   } else {
    //     router.replace(paths.profile.company);
    //   }
    // }
  }, [authenticated, method, router, isKYC, user_role]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
