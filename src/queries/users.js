import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//
export const getAllUsers = async () =>
  (await axios.get(`${HOST_ADDRESS}/appAdmin/UserManagement/`)).data;

export const useGetAllUsers = () =>
  useQuery(['AllUsers'], getAllUsers, {
    retry: 1,
    refetchOnReconnect: 'always',
    refetchInterval: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
