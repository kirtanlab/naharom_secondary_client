import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//
export async function generateOTP(RequestData) {
  return axios.post(`${HOST_ADDRESS}/generateOTP/`, RequestData).then((res) => res.data);
}
export const useGenerateOTP = () => {
  const mutation = useMutation(generateOTP);
  return mutation;
};
export async function verifyOTP(RequestData) {
  return axios.post(`${HOST_ADDRESS}/verifyOTP/`, RequestData).then((res) => res.data);
}
export const useVerifyOTP = () => {
  const mutation = useMutation(verifyOTP);
  return mutation;
};
