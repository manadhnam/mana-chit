import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {ArrowLeftIcon, UserGroupIcon} from '@heroicons/react/24/outline';
import { BanknotesIcon, ChartBarIcon, ClockIcon, PencilSquareIcon, CreditCardIcon } from '@heroicons/react/24/solid';

interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  totalTransactions: number;
  totalAmount: number;
  commission: number;
  recentTransactions: {
    id: string;
    type: 'deposit' | 'withdrawal' | 'commission' | 'payment';
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    const fetchProfile = async () => {
      try {
        // Replace with actual API call
        const response = await new Promise<AgentProfile>((resolve) => {
          setTimeout(() => {
            resolve({
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              status: 'active',
              totalTransactions: 150,
              totalAmount: 25000,
              commission: 1250,
              recentTransactions: [
                {
                  id: '1',
                  type: 'deposit',
                  amount: 1000,
                  date: '2024-03-15',
                  status: 'completed'
                },
                {
                  id: '2',
                  type: 'withdrawal',
                  amount: 500,
                  date: '2024-03-14',
                  status: 'completed'
                },
                {
                  id: '3',
                  type: 'commission',
                  amount: 50,
                  date: '2024-03-13',
                  status: 'completed'
                }
              ]
            });
          }, 1000);
        });
        setProfile(response);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <BanknotesIcon className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <BanknotesIcon className="h-5 w-5 text-red-500" />;
      case 'commission':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCardIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <BanknotesIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Profile not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
                <p className="text-sm text-gray-500">{profile.phone}</p>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 flex items-center">
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                      <dd className="text-lg font-semibold text-gray-900">{profile.totalTransactions}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BanknotesIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                      <dd className="text-lg font-semibold text-gray-900">${profile.totalAmount.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Commission</dt>
                      <dd className="text-lg font-semibold text-gray-900">${profile.commission.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                      <dd className="text-lg font-semibold text-gray-900 capitalize">{profile.status}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Type</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {profile.recentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  {getTransactionIcon(transaction.type)}
                                  <span className="ml-2 capitalize">{transaction.type}</span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                ${transaction.amount.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  transaction.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 