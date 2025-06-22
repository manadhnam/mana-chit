import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';
import { Customer } from '@/types/database';

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;
      setCustomers(customersData || []);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'active' | 'rejected' | 'inactive' | 'pending') => {
    const { error } = await supabase
      .from('customers')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to update status.`);
    } else {
      toast.success(`Customer has been ${status}.`);
      await log_audit('super_admin.customer.status_change', { customer_id: id, new_status: status });
      fetchCustomers(); // Refetch to get the latest data
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  const pendingCustomers = customers.filter(c => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
       <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Approve, reject, and manage all customers.
          </p>
        </div>
        <Link to="/super-admin/customers/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            Add New Customer
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Inactive</div>
          <div className="text-2xl font-bold text-red-600">{inactiveCustomers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCustomers}</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center p-8"><p>Loading...</p></div>
      ) : error ? (
        <div className="text-center p-8 text-red-500"><p>{error}</p></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-white">{customer.email}</div><div className="text-sm text-gray-500 dark:text-gray-400">{customer.mobile}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 dark:text-white">{customer.code}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      customer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {customer.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleUpdateStatus(customer.id, 'active')} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">Approve</button>
                        <button onClick={() => handleUpdateStatus(customer.id, 'rejected')} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Reject</button>
                      </div>
                    ) : (
                      <Link to={`/super-admin/customers/${customer.id}`} className="text-primary-600 hover:text-primary-900">View Details</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
