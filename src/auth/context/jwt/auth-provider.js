import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { getSession, setImpersonateSession, setLocalSession } from './utils';

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
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
      const { userId } = getSession();
      console.log(userId);

      if (userId) {
        setLocalSession({ userId });
        dispatch({
          type: 'INITIAL',
          payload: {
            userId,
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

  useEffect(() => {
    initialize();
  }, [initialize]);

  // // LOGIN
  // const login = useCallback(async (email, password) => {
  //   const data = {
  //     email,
  //     password,
  //   };

  //   const response = await axios.post(endpoints.auth.login, data);

  //   const { accessToken, user } = response.data;

  //   setSession({ accessToken, userId: 2 });

  //   dispatch({
  //     type: 'LOGIN',
  //     payload: {
  //       user,
  //     },
  //   });
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
  const logout = useCallback(async ({ isImpersonateLogout }) => {
    if (isImpersonateLogout) {
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
      //
      // login,
      // register,
      logout,
    }),
    [logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
