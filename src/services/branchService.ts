import { api } from '@/lib/api';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'active' | 'inactive';
  manager: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  stats: {
    totalCustomers: number;
    activeLoans: number;
    totalCollections: number;
    onTimePayers: number;
    defaulters: number;
    availableFund: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBranchData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'active' | 'inactive';
  manager: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface UpdateBranchData extends Partial<CreateBranchData> {
  id: string;
}

class BranchService {
  async getBranches(): Promise<Branch[]> {
    const response = await api.get('/branches');
    return response.data;
  }

  async getBranch(id: string): Promise<Branch> {
    const response = await api.get(`/branches/${id}`);
    return response.data;
  }

  async createBranch(data: CreateBranchData): Promise<Branch> {
    const response = await api.post('/branches', data);
    return response.data;
  }

  async updateBranch(data: UpdateBranchData): Promise<Branch> {
    const response = await api.put(`/branches/${data.id}`, data);
    return response.data;
  }

  async deleteBranch(id: string): Promise<void> {
    await api.delete(`/branches/${id}`);
  }

  async getBranchStats(id: string): Promise<Branch['stats']> {
    const response = await api.get(`/branches/${id}/stats`);
    return response.data;
  }

  async getBranchStaff(id: string): Promise<any[]> {
    const response = await api.get(`/branches/${id}/staff`);
    return response.data;
  }

  async getBranchCustomers(id: string): Promise<any[]> {
    const response = await api.get(`/branches/${id}/customers`);
    return response.data.map((c: any, idx: number) => ({
      id: c.id ?? String(idx),
      name: c.name ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      address: c.address ?? '',
      village_id: c.village_id ?? '',
      aadhar_number: c.aadhar_number ?? '',
      pan_number: c.pan_number ?? '',
      date_of_birth: c.date_of_birth ?? '',
      gender: c.gender ?? 'other',
      occupation: c.occupation ?? '',
      monthly_income: c.monthly_income ?? 0,
      status: c.status ?? 'inactive',
      documents: Array.isArray(c.documents)
        ? c.documents.map((d: any, didx: number) => ({
            id: d.id ?? String(didx),
            type: d.type ?? '',
            url: d.url ?? '',
            verified: d.verified ?? false,
            ...d,
          }))
        : [],
      created_at: c.created_at ?? '',
      updated_at: c.updated_at ?? '',
    }));
  }

  async getBranchLoans(id: string): Promise<any[]> {
    const response = await api.get(`/branches/${id}/loans`);
    return response.data.map((l: any, idx: number) => ({
      id: l.id ?? String(idx),
      customer_id: l.customer_id ?? '',
      customer_name: l.customer_name ?? '',
      amount: l.amount ?? 0,
      interest_rate: l.interest_rate ?? 0,
      term_months: l.term_months ?? 0,
      start_date: l.start_date ?? '',
      end_date: l.end_date ?? '',
      status: l.status ?? 'active',
      payment_frequency: l.payment_frequency ?? 'monthly',
      next_payment_date: l.next_payment_date ?? '',
      next_payment_amount: l.next_payment_amount ?? 0,
      total_paid: l.total_paid ?? 0,
      remaining_amount: l.remaining_amount ?? 0,
      documents: Array.isArray(l.documents)
        ? l.documents.map((d: any, didx: number) => ({
            id: d.id ?? String(didx),
            type: d.type ?? '',
            url: d.url ?? '',
            verified: d.verified ?? false,
            ...d,
          }))
        : [],
      created_at: l.created_at ?? '',
      updated_at: l.updated_at ?? '',
    }));
  }

  async getBranchCollections(id: string): Promise<any[]> {
    const response = await api.get(`/branches/${id}/collections`);
    return response.data;
  }

  async exportBranchData(id: string, format: 'csv' | 'excel'): Promise<Blob> {
    const response = await api.get(`/branches/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }
}

export const branchService = new BranchService();