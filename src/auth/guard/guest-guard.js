import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function GuestGuard({ children }) {
  const router = useRouter();

  const [searchParams, setSearchParams] = useSearchParams();

  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const { authenticated, isKYC, isBank, method, user_role } = useAuthContext();
  // console.log('GuestGuard: ', isKYC, authenticated);
  const check = useCallback(() => {
    if (authenticated && !isKYC) {
      if (user_role === 'Individual') {
        // console.log('entering individual');
        router.replace(paths.profile.user);
      } else {
        router.replace(paths.profile.company);
      }
    } else if (authenticated && isKYC) {
      router.replace(paths.dashboard.root);
    }
  }, [authenticated, router, isKYC, user_role]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
