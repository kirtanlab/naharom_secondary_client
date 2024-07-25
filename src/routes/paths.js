// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      onboard: `${ROOTS.AUTH}/jwt/onboard`,
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  profile: {
    user: `${ROOTS.PROFILE}/user`,
    company: `${ROOTS.PROFILE}/company`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    Auction: `${ROOTS.DASHBOARD}/Auction`,
    ContractMgt: `${ROOTS.DASHBOARD}/ContractMgt`,
    UsersMgt: `${ROOTS.DASHBOARD}/UsersMgt`,
    Profile: `${ROOTS.DASHBOARD}/Profile`,
  },
};
