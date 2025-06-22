import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  branch_id: string;
  branch_name: string;
  total_amount: number;
  monthly_contribution: number;
  duration_months: number;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
  members: GroupMember[];
  collections: GroupCollection[];
}

interface GroupMember {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  joined_date: string;
  payment_status: 'paid' | 'pending' | 'overdue';
  total_paid: number;
}

interface GroupCollection {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  payment_date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: string;
}

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('chit_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;

      // Fetch branch name
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select('name')
        .eq('id', groupData.branch_id)
        .single();

      if (branchError) throw branchError;

      // Fetch group members
      const { data: groupMembers, error: membersError } = await supabase
        .from('chit_group_members')
        .select('customer_id, joined_date')
        .eq('chit_group_id', groupId);

      if (membersError) throw membersError;

      // Fetch customer details for members
      const customerIds = groupMembers?.map(m => m.customer_id) || [];
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name, email')
        .in('id', customerIds);

      if (customersError) throw customersError;

      // Create a map of customer details
      const customerMap = new Map<string, { name: string; email: string }>();
      customersData?.forEach(customer => {
        customerMap.set(customer.id, { name: customer.name, email: customer.email });
      });

      // Fetch collections for this group
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .eq('chit_group_id', groupId)
        .order('payment_date', { ascending: false });

      if (collectionsError) throw collectionsError;

      // Create a map of customer payment status
      const customerPaymentMap = new Map<string, { total_paid: number; last_payment: string }>();
      collectionsData?.forEach(collection => {
        const existing = customerPaymentMap.get(collection.customer_id);
        if (existing) {
          existing.total_paid += collection.amount;
          if (collection.payment_date > existing.last_payment) {
            existing.last_payment = collection.payment_date;
          }
        } else {
          customerPaymentMap.set(collection.customer_id, {
            total_paid: collection.amount,
            last_payment: collection.payment_date
          });
        }
      });

      // Transform the data
      const transformedGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description || '',
        branch_id: groupData.branch_id,
        branch_name: branchData.name,
        total_amount: groupData.total_amount,
        monthly_contribution: groupData.monthly_contribution,
        duration_months: groupData.duration_months,
        status: groupData.status,
        created_at: groupData.created_at,
        members: (groupMembers || []).map(member => {
          const customer = customerMap.get(member.customer_id);
          const paymentInfo = customerPaymentMap.get(member.customer_id);
          return {
            id: member.customer_id,
            customer_id: member.customer_id,
            customer_name: customer?.name || 'Unknown Customer',
            customer_email: customer?.email || '',
            joined_date: member.joined_date,
            payment_status: paymentInfo ? 'paid' : 'pending',
            total_paid: paymentInfo?.total_paid || 0,
          };
        }),
        collections: (collectionsData || []).map(collection => {
          const customer = customerMap.get(collection.customer_id);
          return {
            id: collection.id,
            customer_id: collection.customer_id,
            customer_name: customer?.name || 'Unknown Customer',
            amount: collection.amount,
            payment_date: collection.payment_date,
            status: collection.status,
            payment_method: collection.payment_method || 'Cash',
          };
        }),
      };

      setGroup(transformedGroup);
      
      // Log audit
      await log_audit('super_admin.group.view', {
        group_id: groupId,
        group_name: transformedGroup.name,
        action: 'Viewed group details'
      });

    } catch (err) {
      console.error('Error fetching group details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch group details');
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchGroupDetails}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Group not found.</p>
        </div>
      </div>
    );
  }

  const totalCollections = group.collections.reduce((sum, c) => sum + c.amount, 0);
  const paidCollections = group.collections.filter(c => c.status === 'paid').length;
  const pendingCollections = group.collections.filter(c => c.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              group.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : group.status === 'completed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Group Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Group Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Branch:</span> {group.branch_name}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{group.total_amount.toLocaleString()}</p>
                <p><span className="font-medium">Monthly Contribution:</span> ₹{group.monthly_contribution.toLocaleString()}</p>
                <p><span className="font-medium">Duration:</span> {group.duration_months} months</p>
                <p><span className="font-medium">Created:</span> {new Date(group.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Members</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total Members:</span> {group.members.length}</p>
                <p><span className="font-medium">Active Members:</span> {group.members.filter(m => m.payment_status === 'paid').length}</p>
                <p><span className="font-medium">Pending Members:</span> {group.members.filter(m => m.payment_status === 'pending').length}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Collections</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total Collected:</span> ₹{totalCollections.toLocaleString()}</p>
                <p><span className="font-medium">Paid:</span> {paidCollections} payments</p>
                <p><span className="font-medium">Pending:</span> {pendingCollections} payments</p>
                <p><span className="font-medium">Collection Rate:</span> {group.members.length > 0 ? Math.round((paidCollections / group.members.length) * 100) : 0}%</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Progress</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Months Completed:</span> {Math.floor(totalCollections / group.monthly_contribution)}</p>
                <p><span className="font-medium">Remaining Months:</span> {Math.max(0, group.duration_months - Math.floor(totalCollections / group.monthly_contribution))}</p>
                <p><span className="font-medium">Completion:</span> {Math.min(100, Math.round((totalCollections / group.total_amount) * 100))}%</p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Group Members</h2>
            {group.members.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No members in this group yet.</p>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {group.members.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.customer_name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{member.customer_email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(member.joined_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{member.total_paid.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.payment_status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : member.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {member.payment_status.charAt(0).toUpperCase() + member.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/super-admin/customers/${member.customer_id}`} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            View Customer
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Collections */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Collection History</h2>
            {group.collections.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No collection history available.</p>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {group.collections.map(collection => (
                      <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(collection.payment_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <Link 
                            to={`/super-admin/customers/${collection.customer_id}`} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {collection.customer_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₹{collection.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {collection.payment_method}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            collection.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : collection.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
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

export default GroupDetail;
