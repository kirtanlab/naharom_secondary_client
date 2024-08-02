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
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    }
  );
