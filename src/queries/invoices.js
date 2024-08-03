import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//

export const useGetAllInvoices = ({ userId, timeoutMs = 10000 }) =>
  useQuery(
    ['AllInvoices', userId],
    async () => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);

      try {
        const response = await axios.get(`${HOST_ADDRESS}/appAdmin/InvoiceMgt/${userId}`, {
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

export const usePostInvoice = ({ userId, timeoutMs = 10000 }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data) => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);

      try {
        const response = await axios.post(`${HOST_ADDRESS}/appAdmin/PostInvoice/`, data, {
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
    //  {
    //   onMutate: async (newInvoice) => {
    //     await queryClient.cancelQueries(['AllInvoices', userId]);
    //     const previousInvoices = queryClient.getQueryData(['AllInvoices', userId]);
    //     queryClient.setQueryData(['AllInvoices', userId], (old) => [...old, newInvoice]);
    //     return { previousInvoices };
    //   },
    //   onError: (err, newInvoice, context) => {
    //     queryClient.setQueryData(['AllInvoices', userId], context.previousInvoices);
    //   },
    //   onSettled: () => {
    //     queryClient.invalidateQueries(['AllInvoices', userId]);
    //   },
    // }
    {
      onSuccess: () => {
        // Invalidate the specific query
        queryClient.invalidateQueries(['AllInvoices', userId]);
      },
    }
  );

  return mutation;
};
