// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

// export const setSession = (accessToken) => {
// if (accessToken) {
// localStorage.setItem('accessToken', accessToken);

// axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

// const { exp } = jwtDecode(accessToken);
// tokenExpired(exp);
// } else {
//   localStorage.removeItem('accessToken');

//   delete axios.defaults.headers.common.Authorization;
// }
// };

export const setImpersonateSession = ({ userId }) => {
  if (userId) {
    sessionStorage.setItem('ImpersonateUserId', userId);
    sessionStorage.setItem('isImpersonate', true);
  } else {
    sessionStorage.removeItem('ImpersonateUserId');
  }
};
export const setLocalSession = ({ userId, phoneNumber }) => {
  if (userId) {
    localStorage.setItem('userId', userId);
  } else {
    localStorage.removeItem('userId');
  }
};
export const getSession = () =>
  new Promise((resolve) => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      const isImpersonate = sessionStorage.getItem('isImpersonate') === 'true';
      const ImpersonateUserId = sessionStorage.getItem('ImpersonateUserId');
      const LocalUserId = localStorage.getItem('userId');
      const userId = isImpersonate ? ImpersonateUserId : LocalUserId;

      resolve({ userId });
    }, 0);
  });

export const checkImpersonate = () => {
  const isImpersonate = sessionStorage.getItem('isImpersonate') ?? false;
  return isImpersonate;
};
