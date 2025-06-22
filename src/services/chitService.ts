import { ChitGroup, Customer, Payment, GroupSettings } from '@/types/chit';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export const chitService = {
  // Group Management
  async createGroup(data: Omit<ChitGroup, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post('/chit-groups', data);
      toast.success('Chit group created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create chit group');
      throw error;
    }
  },

  async getGroups(branchId: string) {
    try {
      const response = await api.get(`/chit-groups?branchId=${branchId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch chit groups');
      throw error;
    }
  },

  // Customer Management
  async addCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post('/customers', data);
      toast.success('Customer added successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to add customer');
      throw error;
    }
  },

  async approveCustomer(customerId: string, approvedBy: string) {
    try {
      const response = await api.patch(`/customers/${customerId}/approve`, { approvedBy });
      toast.success('Customer approved successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to approve customer');
      throw error;
    }
  },

  // Payment Management
  async recordPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await api.post('/payments', data);
      toast.success('Payment recorded successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to record payment');
      throw error;
    }
  },

  async getPayments(branchId: string, startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams({ branchId });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/payments?${params.toString()}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch payments');
      throw error;
    }
  },

  // Group Settings
  async updateGroupSettings(data: GroupSettings) {
    try {
      const response = await api.put('/group-settings', data);
      toast.success('Group settings updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update group settings');
      throw error;
    }
  },

  async getGroupSettings() {
    try {
      const response = await api.get('/group-settings');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch group settings');
      throw error;
    }
  },

  // Export Functions
  async exportPayments(branchId: string, format: 'csv' | 'json', startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams({ branchId, format });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/payments/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-${branchId}-${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Failed to export payments');
      throw error;
    }
  }
}; 