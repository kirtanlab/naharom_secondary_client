import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { getStatus } from 'src/queries/auth';
import { AuthContext } from './auth-context';
import { checkImpersonate, getSession, setImpersonateSession, setLocalSession } from './utils';

const initialState = {
  user: null,
  loading: true,
  isKYC: false,
  isBank: false,
  user_role: 'Individual',
  phoneNumber: '',
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.userId,
      isKYC: action.payload.isKYC,
      isBank: action.payload.isBank,
      user_role: action.payload.user_role,
      phoneNumber: action.payload.phoneNumber,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      isKYC: false,
      isBank: false,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const { userId } = await getSession();
      console.log(userId);

      if (userId) {
        const response = await getStatus(userId);
        const { is_KYC, is_BankDetailsExists, user, user_role, phone } = response;
        console.log('response main: ', response);
        setLocalSession({ userId });
        dispatch({
          type: 'INITIAL',
          payload: {
            userId,
            isKYC: is_KYC,
            isBank: is_BankDetailsExists,
            user_role,
            phoneNumber: phone,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  const testDemo = useCallback(async (userId) => {
    setLocalSession({ userId });
    dispatch({
      type: 'INITIAL',
      payload: {
        userId,
        isKYC: true,
        isBank: true,
        user_role: 'Individual',
        phoneNumber: '9016222140',
      },
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);
  // const kycComplete =

  // // LOGIN
  // const login = useCallback(async (email, password) => {
  //   const data = {
  //     email,
  //     password,
  //   };

  //   const response = await axios.post(endpoints.auth.login, data);

  //   const { accessToken, user } = response.data;

  //   setSession({ accessToken, userId: 2 });

  // dispatch({
  //   type: 'LOGIN',
  //   payload: {
  //     user,
  //   },
  // });
  // }, []);

  // // REGISTER
  // const register = useCallback(async (email, password, firstName, lastName) => {
  //   const data = {
  //     email,
  //     password,
  //     firstName,
  //     lastName,
  //   };

  //   const response = await axios.post(endpoints.auth.register, data);

  //   const { accessToken, user } = response.data;

  //   localStorage.setItem(STORAGE_KEY, accessToken);

  //   dispatch({
  //     type: 'REGISTER',
  //     payload: {
  //       user,
  //     },
  //   });
  // }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    const isImpersonate = checkImpersonate();
    if (isImpersonate) {
      setImpersonateSession({ userId: null });
    } else {
      setLocalSession({ userId: null });
    }
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  console.log('Checking user: ', checkAuthenticated);
  const status = state.loading ? 'loading' : checkAuthenticated;

  // const memoizedValue = useMemo(
  //   () => ({
  //     user: state.user,
  //     method: 'jwt',
  //     loading: status === 'loading',
  //     authenticated: status === 'authenticated',
  //     unauthenticated: status === 'unauthenticated',
  //     //
  //     login,
  //     register,
  //     logout,
  //   }),
  //   [login, logout, register, state.user, status]
  // );
  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      isKYC: state.isKYC,
      isBank: state.isBank,
      user_role: state.user_role,
      phoneNumber: state.phoneNumber,
      testDemo,
      //
      // login,
      // register,
      logout,
      initialize,
    }),
    [
      state.phoneNumber,
      testDemo,
      initialize,
      logout,
      state.user,
      status,
      state.isKYC,
      state.isBank,
      state.user_role,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
