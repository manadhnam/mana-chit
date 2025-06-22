import axios, { AxiosResponse } from 'axios';

export interface Notification {
  id: string;
  message: string;
  date: string;
  status: string;
  channel: string;
}

export const getNotifications = async (): Promise<AxiosResponse<Notification[]>> => axios.get('/api/notifications');
export const sendNotification = async (data: any): Promise<AxiosResponse<Notification>> => axios.post('/api/notifications', data);
export const markAsRead = async (id: string): Promise<AxiosResponse<Notification>> => axios.patch(`/api/notifications/${id}/read`); 