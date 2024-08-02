import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//

export const useGetAllUsers = (userId, timeoutMs = 10000) =>
  useQuery(
    ['AllUsers', userId],
    async () => {
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out');
      }, timeoutMs);

      try {
        const response = await axios.get(`${HOST_ADDRESS}/appAdmin/UserManagement/${userId}`, {
          cancelToken: source.token,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (axios.isCancel(error)) {
          throw new Error('Request timed out');
        }
        if (error.response && error.response.status === 404) {
          console.log('User not found');
          return null;
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
      enabled: !!userId,
    }
  );
