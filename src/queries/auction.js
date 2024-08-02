import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'src/auth/context/jwt/utils';
import { HOST_ADDRESS } from './host';
//

const fetchInvoices = async (userId, timeoutMs) => {
  console.log('Fetching data for userId:', userId); // Add log here
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
};

export const useGetAllInvoicesById = ({ userId, timeoutMs = 60000 }) =>
  useQuery(['AllInvoicesById', userId], () => fetchInvoices(userId, timeoutMs), {
    retry: 2,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, // Cache the data for 10 minutes
    staleTime: Infinity, // Consider data fresh for 6 seconds
    keepPreviousData: true,
  });
