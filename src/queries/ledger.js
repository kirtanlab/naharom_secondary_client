import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//
export const useGetUserLedger = ({ userId, timeoutMs = 10000 }) =>
  useQuery(
    ['UserLedger', userId],
    async () => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);

      try {
        const response = await axios.get(`${HOST_ADDRESS}/ledger/${userId}`, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    {
      retry: 2,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 10, // Cache the data for 10 minutes
      staleTime: 0, // Consider data stale immediately
    }
  );

export const useGetAdminLedger = ({ userId, timeoutMs = 10000 }) =>
  useQuery(
    ['AdminLedger', userId],
    async () => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);

      try {
        const response = await axios.get(`${HOST_ADDRESS}/appAdmin/usersLedger/${userId}`, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    {
      retry: 2,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 10, // Cache the data for 10 minutes
      staleTime: 0, // Consider data stale immediately
    }
  );

export const useCreditFunds = ({ userId, timeoutMs = 10000 }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data) => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);
      try {
        const response = await axios.post(`${HOST_ADDRESS}/Credit_Funds/`, data, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        console.log('error,', error);
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        // Invalidate the specific query
        // queryClient.invalidateQueries(['AllInvoicesById', userId]);
      },
    }
  );
  return mutation;
};
export const useWithdrawFunds = ({ userId, timeoutMs = 10000 }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data) => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);
      try {
        const response = await axios.post(`${HOST_ADDRESS}/Withdraw_Funds/`, data, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        console.log('error,', error);
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          throw new Error('Request timed out');
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        // Invalidate the specific query
        // queryClient.invalidateQueries(['AllInvoicesById', userId]);
      },
    }
  );
  return mutation;
};
