import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//

export const useGenerateOTP = (timeoutMs = 10000) => {
  const mutation = useMutation(async (data) => {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timed out');
    }, timeoutMs);

    try {
      const response = await axios.post(`${HOST_ADDRESS}/generateOTP/`, data, {
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

  return mutation;
};
export async function verifyOTP(RequestData) {
  return axios.post(`${HOST_ADDRESS}/verifyOtp/`, RequestData).then((res) => res.data);
}
export const useVerifyOTP = () => {
  const mutation = useMutation(verifyOTP);
  return mutation;
};

export const getStatus = async (userId) =>
  axios.get(`${HOST_ADDRESS}/verifyStatus/${userId}`).then((res) => res.data);
