import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'src/auth/context/jwt/utils';
import { HOST_ADDRESS } from './host';
//

export const useGetAllInvoicesById = ({ userId, timeoutMs = 60000 }) =>
  useQuery(['AllInvoicesById', userId], async () => {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timed out');
    }, timeoutMs);
    try {
      const response = await axios.get(`${HOST_ADDRESS}/GetSellPurchaseDetails/${userId}`, {
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
  });

export const useBuyInvoice = ({ userId, timeoutMs = 60000 }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data) => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);
      try {
        const response = await axios.post(`${HOST_ADDRESS}/ToBuy/`, data, {
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
      onSuccess: () => {
        // Invalidate the specific query
        queryClient.invalidateQueries(['AllInvoicesById', userId]);
      },
    }
  );
  return mutation;
};
export const useSellInvoice = ({ userId, timeoutMs = 10000 }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data) => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);
      try {
        const response = await axios.post(`${HOST_ADDRESS}/PostForSell/`, data, {
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
        queryClient.invalidateQueries(['AllInvoicesById', userId]);
      },
    }
  );
  return mutation;
};
