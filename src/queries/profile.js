import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//
export const getIndividualDetails = async (userId) => {
  try {
    const response = await axios.get(`${HOST_ADDRESS}/phoneToPrefill/${userId}/`);
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

export const useGetIndividualDetails = (userId) =>
  useQuery(['IndividualProfile', userId], () => getIndividualDetails(userId), {
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

export async function submitProfile(data) {
  return axios.post(`${HOST_ADDRESS}/submitProfile/`, data).then((res) => res.data);
}

export const useSubmitProfile = () => {
  const mutation = useMutation(submitProfile);
  return mutation;
};
