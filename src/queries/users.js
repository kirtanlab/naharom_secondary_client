import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//

export const getAllUsers = async (userId) => {
  try {
    const response = await axios.get(`${HOST_ADDRESS}/appAdmin/UserManagement/${userId}/`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 error
      console.log('User not found');
      return null; // or you could throw a custom error
    }
    // For other errors, rethrow
    throw error;
  }
};

export const useGetAllUsers = (userId) =>
  useQuery(['AllUsers', userId], () => getAllUsers(userId), {
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.response && error.response.status === 404) return false;
      // Retry once for other errors
      return failureCount < 1;
    },

    refetchOnReconnect: 'never',
    // refetchInterval: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    enabled: !!userId, // Only run the query if userId is provided
  });
