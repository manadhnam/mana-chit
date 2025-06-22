import { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Transaction } from '@/types/database';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CustomerProfile {
  id: string;
  customer_id: string;
  personal_info: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    occupation: string;
    income: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  documents: {
    id_proof: string;
    address_proof: string;
    photo: string;
  };
  accounts: {
    savings: {
      account_number: string;
      balance: number;
      status: string;
    };
    chits: {
      id: string;
      name: string;
      amount: number;
      status: string;
    }[];
    loans: {
      id: string;
      type: string;
      amount: number;
      status: string;
    }[];
  };
  created_at: string;
  updated_at: string;
}

const CustomerProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions' | 'documents'>(
    'overview'
  );

  useEffect(() => {
    fetchCustomerProfile();
    fetchTransactions();
  }, []);

  const fetchCustomerProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      const mockCustomer: CustomerProfile = {
        id: '1',
        customer_id: '1',
        personal_info: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          dob: '1990-01-01',
          gender: 'Male',
          occupation: 'Software Engineer',
          income: 100000,
        },
        address: {
          street: '123 Main St',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
        },
        documents: {
          id_proof: 'aadhar.pdf',
          address_proof: 'electricity_bill.pdf',
          photo: 'photo.jpg',
        },
        accounts: {
          savings: {
            account_number: 'SAV001',
            balance: 50000,
            status: 'active',
          },
          chits: [
            {
              id: '1',
              name: 'Monthly Chit',
              amount: 10000,
              status: 'active',
            },
          ],
          loans: [
            {
              id: '1',
              type: 'Personal Loan',
              amount: 50000,
              status: 'active',
            },
          ],
        },
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      setCustomer(mockCustomer);
    } catch (error) {
      toast.error('Failed to load customer profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user_id: '1',
          type: 'deposit',
          amount: 10000,
          status: 'completed',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const getTransactionChartData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const deposits = [10000, 15000, 12000, 18000, 20000, 25000];
    const withdrawals = [5000, 8000, 6000, 9000, 10000, 12000];

    return {
      labels,
      datasets: [
        {
          label: 'Deposits',
          data: deposits,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Withdrawals',
          data: withdrawals,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
      ],
    };
  };

  if (isLoading || !customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Profile
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage customer information
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {customer.personal_info.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customer ID: {customer.customer_id}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Information
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.personal_info.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.personal_info.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Personal Information
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.personal_info.occupation}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      ₹{customer.personal_info.income.toLocaleString()}/month
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Address
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.address.street}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.address.city}, {customer.address.state} - {customer.address.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`${
              activeTab === 'accounts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Accounts
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`${
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account Summary
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Savings Balance
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          ₹{customer.accounts.savings.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Active Chits
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {customer.accounts.chits.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Active Loans
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {customer.accounts.loans.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Transaction History
                </h3>
                <div className="h-64">
                  <Line
                    data={getTransactionChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Savings Account
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account Number
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {customer.accounts.savings.account_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Balance
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{customer.accounts.savings.balance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {customer.accounts.savings.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Chit Groups
                </h3>
                <div className="space-y-4">
                  {customer.accounts.chits.map((chit) => (
                    <div key={chit.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Name
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {chit.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Amount
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ₹{chit.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {chit.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Loans
                </h3>
                <div className="space-y-4">
                  {customer.accounts.loans.map((loan) => (
                    <div key={loan.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Type
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {loan.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Amount
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ₹{loan.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {loan.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'deposit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  ID Proof
                </h4>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={customer.documents.id_proof}
                    alt="ID Proof"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Address Proof
                </h4>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={customer.documents.address_proof}
                    alt="Address Proof"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Photo
                </h4>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={customer.documents.photo}
                    alt="Photo"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile; 