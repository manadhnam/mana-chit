import axios, { AxiosResponse } from 'axios';

export interface Receipt {
  id: string;
  group: string;
  amount: number;
  date: string;
  file?: string;
}

export const getReceipts = async (): Promise<AxiosResponse<Receipt[]>> => axios.get('/api/receipts');
export const createReceipt = async (data: any): Promise<AxiosResponse<Receipt>> => axios.post('/api/receipts', data);
export const downloadReceipt = async (id: string): Promise<AxiosResponse<Blob>> => axios.get(`/api/receipts/${id}/download`, { responseType: 'blob' });
export const deleteReceipt = async (id: string): Promise<AxiosResponse<void>> => axios.delete(`/api/receipts/${id}`); 