export type UserRole = 'superAdmin' | 'departmentHead' | 'mandalHead' | 'branchManager' | 'agent' | 'user';
export type IdProofType = 'AADHAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE';
export type ChitGroupStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed' | 'defaulted';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type UserStatus = 'pending' | 'active' | 'inactive' | 'suspended' | 'rejected';
export type TransactionType = 'loan_repayment' | 'chit_contribution' | 'wallet_deposit' | 'wallet_withdrawal' | 'referral_bonus' | 'loan_disbursement' | 'chit_payout';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  branch_id?: string;
  mandal_id?: string;
  department_id?: string;
  id_proof_type?: IdProofType;
  id_proof_file?: string;
  id_proof_verified: boolean;
  wallet_balance: number;
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  mandal_id?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Mandal {
  id: string;
  name: string;
  department_id?: string;
  head_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  head_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChitGroup {
  id: string;
  group_name: string;
  chit_value: number;
  commission_percentage: number;
  description?: string;
  duration: number;
  max_members: number;
  current_cycle: number;
  status: ChitGroupStatus;
  branch_id: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ChitMember {
  id: string;
  chit_group_id: string;
  user_id: string;
  joined_at: string;
  cycle_number?: number;
  grab_date?: string;
}

export interface Contribution {
  id: string;
  chit_group_id: string;
  user_id: string;
  amount: number;
  cycle_number: number;
  payment_date: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  duration: number;
  status: LoanStatus;
  approved_by?: string;
  approved_at?: string;
  disbursed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoanRepayment {
  id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  balance_before?: number;
  balance_after?: number;
  reference_id?: string;
  reference_type?: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  department_id: string;
  position: string;
  joining_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave' | 'pending';
  reporting_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  staff_id: string;
  date: string;
  check_in: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceReview {
  id: string;
  staff_id: string;
  reviewer_id: string;
  period: string;
  rating: number;
  goals_achieved: number;
  goals_total: number;
  strengths: string[];
  areas_for_improvement: string[];
  comments: string;
  status: 'draft' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface DepartmentMetrics {
  id: string;
  department_id: string;
  period: string;
  total_revenue: number;
  total_expenses: number;
  customer_satisfaction: number;
  staff_productivity: number;
  chit_groups_active: number;
  loans_disbursed: number;
  created_at: string;
  updated_at: string;
}

export interface MandalMetrics {
  id: string;
  mandal_id: string;
  period: string;
  total_revenue: number;
  total_expenses: number;
  customer_satisfaction: number;
  staff_productivity: number;
  chit_groups_active: number;
  loans_disbursed: number;
  created_at: string;
  updated_at: string;
}

export interface BranchMetrics {
  id: string;
  branch_id: string;
  period: string;
  total_revenue: number;
  total_expenses: number;
  customer_satisfaction: number;
  staff_productivity: number;
  chit_groups_active: number;
  loans_disbursed: number;
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  code: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: string;
  customer_id: string;
  loan_id?: string;
  chit_group_id?: string;
  amount: number;
  payment_date: string;
  payment_mode: 'cash' | 'bank_transfer' | 'upi';
  receipt_number: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  customer_signature_url?: string;
  agent_signature_url?: string;
  photo_url?: string;
  created_by: string; // user_id of the agent
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  agenda?: string;
  customer_id: string;
  staff_id: string;
  scheduled_at: string; // Full ISO timestamp
  duration_minutes: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location?: string; // For in-person meetings
  meeting_link?: string; // For video meetings
  created_by: string; // user_id of who created the meeting
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string; // The user who made the referral
  referee_id: string; // The user who was referred
  status: 'pending' | 'completed' | 'expired';
  reward_amount?: number;
  reward_paid_at?: string;
  created_at: string;
  updated_at: string;
}

export type AuctionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Auction {
  id: string;
  chit_group_id: string;
  cycle_number: number;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  winner_id?: string;
  winning_bid_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  created_at: string;
} 