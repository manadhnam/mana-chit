import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  UserPlusIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';
import { Customer } from '@/types/database';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AddNewCustomer from './AddNewCustomer';
import { supabase } from '@/lib/supabase';

const CustomerList = () => {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this should be filtered by department.
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) {
        throw error;
      }
      setCustomers(data || []);
    } catch (error) {
      toast.error('Failed to load customers');
      setCustomers([]); // Clear customers on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCustomer = (customerId: string) => {
    toast(`Edit action for customer ${customerId}`);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const { error } = await supabase.from('customers').delete().eq('id', customerId);
      if (error) {
        toast.error('Failed to delete customer.');
      } else {
        toast.success('Customer deleted successfully.');
        fetchCustomers();
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.code.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower);
    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg">Loading Customers...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Department Customer Directory</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">View and manage all customers under your department</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5"><div className="flex items-center"><div className="flex-shrink-0"><UserGroupIcon className="h-6 w-6 text-gray-400" /></div><div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Customers</dt><dd className="flex items-baseline"><div className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.length}</div></dd></dl></div></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5"><div className="flex items-center"><div className="flex-shrink-0"><CheckCircleIcon className="h-6 w-6 text-green-400" /></div><div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Customers</dt><dd className="flex items-baseline"><div className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.filter(c => c.status === 'active').length}</div></dd></dl></div></div></div>
        </motion.div>
      </div>

      <div className="mb-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-1"><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MagnifyingGlassIcon className="h-5 w-5 text-gray-400" /></div><input type="text" name="search" id="search" className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Search by name, code, email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div></div><div className="md:col-span-2 flex justify-end"><div className="flex items-center space-x-2"><FunnelIcon className="h-5 w-5 text-gray-400" /><button onClick={() => setActiveTab('all')} className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>All</button><button onClick={() => setActiveTab('active')} className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'active' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>Active</button><button onClick={() => setActiveTab('inactive')} className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'inactive' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>Inactive</button></div></div></div></div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>{customer.email}</div>
                    <div>{customer.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><div className="flex items-center space-x-2"><button onClick={() => handleEditCustomer(customer.id)} className="text-primary-600 hover:text-primary-900"><PencilIcon className="h-5 w-5"/></button><button onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddNewCustomer 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCustomerAdded={() => {
          setShowAddModal(false);
          fetchCustomers();
        }}
      />
    </div>
  );
};

export default CustomerList; 