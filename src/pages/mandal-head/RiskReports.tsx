import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  groupId: string;
  groupName: string;
  amount: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  riskScore: number;
  documents: string[];
  createdAt: string;
  updatedAt: string;
  branchId: string;
  branchName: string;
}

interface CustomerGroupMapping {
  customerId: string;
  customerName: string;
  groupId: string;
  groupName: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  lastPaymentDate?: string;
  nextDueDate: string;
  totalAmount: number;
  paidAmount: number;
  branchId: string;
  branchName: string;
}

const MandalHeadRiskReports = () => {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroupMapping[]>([]);
  const [activeTab, setActiveTab] = useState<'loans' | 'groups' | 'customers'>('loans');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  // Mock data for development
  const mockLoanApplications: LoanApplication[] = [
    {
      id: '1',
      customerId: 'CUST001',
      customerName: 'Rahul Sharma',
      groupId: 'GROUP001',
      groupName: 'Gold Savings Group',
      amount: 50000,
      purpose: 'Home Renovation',
      status: 'PENDING',
      riskScore: 65,
      documents: ['Aadhar', 'PAN', 'Income Proof', 'Bank Statement'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      branchId: 'BR001',
      branchName: 'North Branch'
    },
    {
      id: '2',
      customerId: 'CUST002',
      customerName: 'Priya Patel',
      groupId: 'GROUP002',
      groupName: 'Silver Investment Group',
      amount: 75000,
      purpose: 'Business Expansion',
      status: 'PENDING',
      riskScore: 45,
      documents: ['Aadhar', 'PAN', 'Business License', 'Bank Statement'],
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      branchId: 'BR002',
      branchName: 'South Branch'
    },
    {
      id: '3',
      customerId: 'CUST003',
      customerName: 'Amit Kumar',
      groupId: 'GROUP003',
      groupName: 'Platinum Growth Group',
      amount: 100000,
      purpose: 'Education Loan',
      status: 'APPROVED',
      riskScore: 25,
      documents: ['Aadhar', 'PAN', 'Admission Letter', 'Bank Statement'],
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      branchId: 'BR001',
      branchName: 'North Branch'
    }
  ];

  const mockCustomerGroups: CustomerGroupMapping[] = [
    {
      customerId: 'CUST001',
      customerName: 'Rahul Sharma',
      groupId: 'GROUP001',
      groupName: 'Gold Savings Group',
      paymentStatus: 'PENDING',
      lastPaymentDate: '2024-01-10',
      nextDueDate: '2024-01-20',
      totalAmount: 50000,
      paidAmount: 45000,
      branchId: 'BR001',
      branchName: 'North Branch'
    },
    {
      customerId: 'CUST002',
      customerName: 'Priya Patel',
      groupId: 'GROUP002',
      groupName: 'Silver Investment Group',
      paymentStatus: 'PAID',
      lastPaymentDate: '2024-01-15',
      nextDueDate: '2024-01-25',
      totalAmount: 75000,
      paidAmount: 75000,
      branchId: 'BR002',
      branchName: 'South Branch'
    },
    {
      customerId: 'CUST003',
      customerName: 'Amit Kumar',
      groupId: 'GROUP003',
      groupName: 'Platinum Growth Group',
      paymentStatus: 'OVERDUE',
      lastPaymentDate: '2024-01-05',
      nextDueDate: '2024-01-15',
      totalAmount: 100000,
      paidAmount: 80000,
      branchId: 'BR001',
      branchName: 'North Branch'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoanApplications(mockLoanApplications);
      setCustomerGroups(mockCustomerGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLoanApproval = (loanId: string, status: 'APPROVED' | 'REJECTED') => {
    setLoanApplications(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, status, updatedAt: new Date().toISOString() }
        : loan
    ));
    toast.success(`Loan application ${status.toLowerCase()} successfully`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    if (score >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const filteredLoanApplications = loanApplications.filter(loan => {
    const matchesSearch = 
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || loan.branchId === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const filteredCustomerGroups = customerGroups.filter(group => {
    const matchesSearch = 
      group.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || group.paymentStatus === statusFilter;
    const matchesBranch = branchFilter === 'all' || group.branchId === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const stats = {
    totalLoans: loanApplications.length,
    pendingLoans: loanApplications.filter(l => l.status === 'PENDING').length,
    approvedLoans: loanApplications.filter(l => l.status === 'APPROVED').length,
    totalCustomers: customerGroups.length,
    overduePayments: customerGroups.filter(g => g.paymentStatus === 'OVERDUE').length,
    totalCollections: customerGroups.reduce((sum, g) => sum + g.paidAmount, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mandal Risk Reports & Approvals</h1>
        <p className="text-gray-600">Review loan applications and monitor customer-group performance across branches</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Loans</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingLoans}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overduePayments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Collections</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalCollections.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('loans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'loans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Loan Applications ({stats.pendingLoans})
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer-Group Mapping ({stats.totalCustomers})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment Status
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {activeTab === 'loans' ? (
                <>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </>
              ) : (
                <>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                </>
              )}
            </select>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Branches</option>
              <option value="BR001">North Branch</option>
              <option value="BR002">South Branch</option>
            </select>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'loans' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Loan Applications ({filteredLoanApplications.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoanApplications.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.customerName}</div>
                        <div className="text-sm text-gray-500">{loan.customerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.groupName}</div>
                        <div className="text-sm text-gray-500">{loan.groupId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(loan.riskScore)}`}>
                        {loan.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.branchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLoanApproval(loan.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleLoanApproval(loan.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer-Group Mapping ({filteredCustomerGroups.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomerGroups.map((group) => (
                  <tr key={`${group.customerId}-${group.groupId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{group.customerName}</div>
                        <div className="text-sm text-gray-500">{group.customerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                        <div className="text-sm text-gray-500">{group.groupId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(group.paymentStatus)}`}>
                        {group.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">₹{group.paidAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">of ₹{group.totalAmount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(group.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.branchName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Status Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Paid</h4>
                <p className="text-3xl font-bold text-green-600">
                  {customerGroups.filter(g => g.paymentStatus === 'PAID').length}
                </p>
                <p className="text-sm text-green-600 mt-1">Customers</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Pending</h4>
                <p className="text-3xl font-bold text-yellow-600">
                  {customerGroups.filter(g => g.paymentStatus === 'PENDING').length}
                </p>
                <p className="text-sm text-yellow-600 mt-1">Customers</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-800 mb-2">Overdue</h4>
                <p className="text-3xl font-bold text-red-600">
                  {customerGroups.filter(g => g.paymentStatus === 'OVERDUE').length}
                </p>
                <p className="text-sm text-red-600 mt-1">Customers</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandalHeadRiskReports; 