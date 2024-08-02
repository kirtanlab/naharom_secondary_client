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

export const useVerifyOTP = (timeoutMs = 10000) => {
  const mutation = useMutation(async (data) => {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timed out');
    }, timeoutMs);

    try {
      const response = await axios.post(`${HOST_ADDRESS}/verifyOtp/`, data, {
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

export const getStatus = async (userId, timeoutMs = 20000) => {
  const source = axios.CancelToken.source();
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      source.cancel('Request timed out');
      reject(new Error('Request timed out'));
    }, timeoutMs)
  );

  try {
    const response = await Promise.race([
      axios.get(`${HOST_ADDRESS}/verifyStatus/${userId}`, {
        cancelToken: source.token,
      }),
      timeout,
    ]);

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('Request timed out');
    }
    throw error;
  }
};
