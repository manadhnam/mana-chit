import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  branch_id: string;
  branch_name: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  groups: CustomerGroup[];
  payments: CustomerPayment[];
}

interface CustomerGroup {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  joined_date: string;
}

interface CustomerPayment {
  id: string;
  amount: number;
  payment_date: string;
  status: 'paid' | 'pending' | 'overdue';
  chit_group_id: string;
  chit_group_name: string;
  payment_method: string;
}

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomerDetails = async () => {
    if (!customerId) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (customerError) throw customerError;

      // Fetch branch name
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select('name')
        .eq('id', customerData.branch_id)
        .single();

      if (branchError) throw branchError;

      // Fetch customer's groups
      const { data: groupMemberships, error: groupsError } = await supabase
        .from('chit_group_members')
        .select('chit_group_id, joined_date')
        .eq('customer_id', customerId);

      if (groupsError) throw groupsError;

      // Fetch chit groups separately
      const groupIds = groupMemberships?.map(m => m.chit_group_id) || [];
      const { data: chitGroupsForCustomer, error: chitGroupsForCustomerError } = await supabase
        .from('chit_groups')
        .select('id, name, status')
        .in('id', groupIds);

      if (chitGroupsForCustomerError) throw chitGroupsForCustomerError;

      // Create a map of chit group details
      const chitGroupDetailsMap = new Map<string, { id: string; name: string; status: string }>();
      chitGroupsForCustomer?.forEach(group => {
        chitGroupDetailsMap.set(group.id, group);
      });

      // Fetch customer's payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('collections')
        .select('*')
        .eq('customer_id', customerId)
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Transform the data
      const transformedCustomer: Customer = {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || '',
        branch_id: customerData.branch_id,
        branch_name: branchData.name,
        status: customerData.status,
        created_at: customerData.created_at,
        groups: (groupMemberships || []).map(membership => {
          const group = chitGroupDetailsMap.get(membership.chit_group_id);
          return {
            id: membership.chit_group_id,
            name: group?.name || 'Unknown Group',
            status: group?.status === 'active' ? 'active' : 'inactive',
            joined_date: membership.joined_date,
          };
        }),
        payments: (paymentsData || []).map(payment => ({
          id: payment.id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          status: payment.status,
          chit_group_id: payment.chit_group_id,
          chit_group_name: chitGroupDetailsMap.get(payment.chit_group_id)?.name || 'Unknown Group',
          payment_method: payment.payment_method || 'Cash',
        })),
      };

      setCustomer(transformedCustomer);
      
      // Log audit
      await log_audit('super_admin.customer.view', {
        customer_id: customerId,
        customer_name: transformedCustomer.name,
        action: 'Viewed customer details'
      });

    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer details');
      toast.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchCustomerDetails}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Customer not found.</p>
        </div>
      </div>
    );
  }

  const totalPayments = customer.payments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = customer.payments.filter(p => p.status === 'paid').length;
  const pendingPayments = customer.payments.filter(p => p.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              customer.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : customer.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                <p><span className="font-medium">Email:</span> {customer.email}</p>
                <p><span className="font-medium">Address:</span> {customer.address || 'Not provided'}</p>
                <p><span className="font-medium">Branch:</span> {customer.branch_name}</p>
                <p><span className="font-medium">Member Since:</span> {new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total Payments:</span> ₹{totalPayments.toLocaleString()}</p>
                <p><span className="font-medium">Paid:</span> {paidPayments} payments</p>
                <p><span className="font-medium">Pending:</span> {pendingPayments} payments</p>
                <p><span className="font-medium">Active Groups:</span> {customer.groups.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Groups Joined</h2>
            {customer.groups.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No groups joined yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.groups.map(group => (
                  <div key={group.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link 
                          to={`/super-admin/groups/${group.id}`} 
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                        >
                          {group.name}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Joined: {new Date(group.joined_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        group.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment History</h2>
            {customer.payments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No payment history available.</p>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Group</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {customer.payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <Link 
                            to={`/super-admin/groups/${payment.chit_group_id}`} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {payment.chit_group_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.payment_method}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail; 