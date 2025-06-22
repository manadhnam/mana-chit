export type GroupPlan = 1000 | 2000 | 3000 | 5000 | 8000 | 10000 | 15000 | 20000;

export interface ChitGroup {
  id: string;
  name: string;
  plan: GroupPlan;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  members: Customer[];
  startDate: string;
  endDate: string;
  createdBy: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  idProof: string; // URL to uploaded document
  photo: string; // URL to uploaded photo
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  groupId?: string;
  branchId: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  collectedBy: string;
  notes?: string;
  proof: string; // URL to uploaded proof
  status: 'pending' | 'approved' | 'rejected';
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchStats {
  totalCustomers: number;
  activeLoans: number;
  totalCollections: number;
  onTimePayers: number;
  defaulters: number;
  availableFund: number;
}

export interface GroupSettings {
  plan: GroupPlan;
  loanLimit: number;
  interestRate: number;
  updatedBy: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'agent' | 'branch_manager';
  branchId: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
} 