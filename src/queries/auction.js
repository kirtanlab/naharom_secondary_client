import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'src/auth/context/jwt/utils';
import { HOST_ADDRESS } from './host';
//
export async function getAllInvoicesById({ queryKey }) {
  console.log('queryKey: ', queryKey);
  const [_, id] = queryKey;
  console.log('id: ', id);
  // return axios.get(`${HOST_ADDRESS}/GetDetails/${id}`, getAuthHeader()).then((res) => res.data);
  return axios.get(`${HOST_ADDRESS}/GetDetails/${id}`).then((res) => res.data);
}
export const useGetAllInvoicesById = () => {
  // const { user } = useAuth();
  // console.log('user: ', user);
  const { userId } = getSession();
  // user?.id
  return useQuery(['AllInvoices', userId], getAllInvoicesById, {
    retry: 1,
    refetchOnReconnect: 'always',
    refetchInterval: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
};
