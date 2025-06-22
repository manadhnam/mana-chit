// User Types
export type UserRole = 'superAdmin' | 'departmentHead' | 'mandalHead' | 'branchManager' | 'agent' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  walletBalance?: number;
  idProof?: string;
  createdAt: string;
  updatedAt: string;
}

// Chit Group Types
export interface ChitGroupMember {
  userId: string;
  userName: string;
  joinedAt: string;
}

export interface ChitGroup {
  id: string;
  name: string;
  amount: number;
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
  members: ChitGroupMember[];
  createdAt: string;
  updatedAt: string;
}

// Loan Types
export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  purpose: string;
  tenure: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  cibilScore?: number;
  documents: string[];
  monthlyPayment: number;
  remainingAmount: number;
  repayments: Repayment[];
}

export interface Repayment {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

// Transaction Types
export type TransactionType = 'deposit' | 'withdrawal' | 'loan' | 'repayment' | 'chit';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  address: string;
  managerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Meeting Types
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

// Settings Types
export interface SettingSection {
  id: string;
  name: string;
  description: string;
  settings: {
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'select';
    options?: string[];
  }[];
} 