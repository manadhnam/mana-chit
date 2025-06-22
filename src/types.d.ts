/// <reference types="react" />
/// <reference types="react-dom" />

// Heroicons module declarations
declare module '@heroicons/react/24/outline' {
  export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Trash2Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const FunnelIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DocumentChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '@heroicons/react/24/solid' {
  export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Trash2Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const FunnelIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DocumentChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Lucide React module declarations
declare module 'lucide-react' {
  export const Bell: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Check: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Trash2: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Filter: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Search: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronUp: React.FC<React.SVGProps<SVGSVGElement>>;
  export const HelpCircle: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Mail: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Phone: React.FC<React.SVGProps<SVGSVGElement>>;
  export const MessageSquare: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Lock: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Moon: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Sun: React.FC<React.SVGProps<SVGSVGElement>>;
  export const User: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Shield: React.FC<React.SVGProps<SVGSVGElement>>;
  export const HardDrive: React.FC<React.SVGProps<SVGSVGElement>>;
  export const AlertOctagon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Application type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super-admin' | 'department-head' | 'mandal-head' | 'branch-manager' | 'agent' | 'customer';

export interface Branch {
  id: string;
  name: string;
  address: string;
  managerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ChitGroup {
  id: string;
  name: string;
  amount: number;
  members: number;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'disbursed';
  interestRate: number;
  term: number;
  userName?: string;
  purpose?: string;
  tenure?: number;
  documents?: string[];
  monthlyPayment?: number;
  repayments?: Repayment[];
  remainingAmount?: number;
  disbursedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'contribution' | 'payment' | 'withdrawal' | 'loan' | 'repayment' | 'deposit';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  status?: 'read' | 'unread';
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  userId: string;
  amount: number;
  type: 'contribution' | 'payment' | 'loan';
  status: 'pending' | 'completed' | 'failed';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  department: string;
  branchId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  agent_id?: string;
  code: string;
  name: string;
  email: string;
  mobile: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'inactive';
  total_chits: number;
  total_loans: number;
  total_savings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  agentId: string;
  customerId: string;
  amount: number;
  type: 'contribution' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  amount: number;
  members: number;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
} 