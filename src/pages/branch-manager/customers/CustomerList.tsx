import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  UserPlusIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  CurrencyRupeeIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';
import { Customer } from '@/types/database';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';

type CustomerStatus = 'active' | 'inactive' | 'pending' | 'rejected';

const statusColors: { [key in CustomerStatus]: string } = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<{ status: CustomerStatus }> = ({ status }) => (
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const CustomerList = () => {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomerStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    if (!user?.branch_id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('branch_id', user.branch_id);

      if (error) {
        throw error;
      }
      setCustomers(data as Customer[]);

    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleEditCustomer = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowAddModal(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        // TODO: Implement customer deletion
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const updateCustomerStatus = async (id: string, name: string, status: 'active' | 'rejected') => {
    if (!user) return;
    const oldStatus = customers.find(c => c.id === id)?.status;

    // Optimistic update
    setCustomers(customers.map(c => (c.id === id ? { ...c, status } : c)));

    const { error } = await supabase
      .from('customers')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to update customer status.`);
      // Revert on failure
      setCustomers(customers.map(c => (c.id === id ? { ...c, status: oldStatus as CustomerStatus } : c)));
    } else {
      toast.success(`Customer ${name} has been ${status === 'active' ? 'approved' : 'rejected'}.`);
      await log_audit(
        `customer_${status === 'active' ? 'approve' : 'reject'}`,
        { customerId: id, customerName: name, branchId: user.branch_id },
        user.id
      );
      fetchCustomers(); // Re-fetch to get the latest state
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!customer.name) return false;
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.code && customer.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = customers.filter(c => c.status === 'pending').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Directory</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View, manage, and approve all customers in your branch.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/branch-manager/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Customers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0"><UserGroupIcon className="h-6 w-6 text-gray-400" /></div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total</dt>
                  <dd><div className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.length}</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Active Customers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
           <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0"><CheckCircleIcon className="h-6 w-6 text-green-500" /></div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active</dt>
                  <dd><div className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.filter(c => c.status === 'active').length}</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Pending Customers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ring-2 ring-yellow-500">
           <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0"><ClockIcon className="h-6 w-6 text-yellow-500" /></div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Approval</dt>
                  <dd><div className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingCount}</div></dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <button onClick={() => setActiveTab('pending')} className="font-medium text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300">
                View all
              </button>
            </div>
          </div>
        </motion.div>
        {/* Rejected Customers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
           <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0"><XCircleIcon className="h-6 w-6 text-red-500" /></div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Rejected</dt>
                  <dd><div className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.filter(c => c.status === 'rejected').length}</div></dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-5 py-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {(['all', 'pending', 'active', 'inactive', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center p-8">Loading customers...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserGroupIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{customer.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={customer.status as CustomerStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/branch-manager/customers/${customer.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View
                        <EyeIcon className="h-4 w-4 ml-1.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList; 