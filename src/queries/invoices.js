import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HOST_ADDRESS } from './host';
//

export const getAllInvoices = async () =>
  (await axios.get(`${HOST_ADDRESS}/appAdmin/InvoiceMgt/1/`)).data;
export const useGetAllInvoices = () =>
  useQuery(['AllInvoices'], getAllInvoices, {
    retry: 1,
    refetchOnReconnect: 'always',
    refetchInterval: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
