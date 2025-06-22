export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'agent' | 'cashier' | 'admin';
  status: 'active' | 'inactive';
  joined_at: string;
  last_active?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  village_id: string;
  aadhar_number: string;
  pan_number: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  monthly_income: number;
  status: 'active' | 'inactive';
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    [key: string]: any;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'defaulted';
  payment_frequency: 'daily' | 'weekly' | 'monthly';
  next_payment_date: string;
  next_payment_amount: number;
  total_paid: number;
  remaining_amount: number;
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    [key: string]: any;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  loan_id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  payment_date: string;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: 'cash' | 'bank_transfer' | 'upi' | 'cheque';
  reference_number?: string;
  notes?: string;
  documents: {
    receipt: boolean;
    bank_statement: boolean;
  };
}

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
    total_customers: number;
    active_loans: number;
    total_collections: number;
    on_time_payers: number;
    defaulters: number;
    available_fund: number;
  };
  created_at: string;
  updated_at: string;
} 