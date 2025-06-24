import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  created_at: string;
  id_proof_url?: string;
  photo_url?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleActionClick = (action: 'approve' | 'reject') => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!customer || !modalAction) return;

    if (modalAction === 'reject' && !rejectionReason.trim()) {
      toast.error('A reason for rejection is required.');
      return;
    }
    
    setLoading(true);
    const newStatus = modalAction === 'approve' ? 'active' : 'rejected';

    // Update customer status
    const { error: customerUpdateError } = await supabase
      .from('customers')
      .update({ status: newStatus })
      .eq('id', customer.id);
      
    // Also update the corresponding user's status
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', customer.user_id);

    setLoading(false);

    if (customerUpdateError || userUpdateError) {
      toast.error('Failed to update customer status.');
    } else {
      toast.success(`Customer has been ${newStatus}.`);
      setCustomer({ ...customer, status: newStatus as any });
      await log_audit(`branch_manager.customer.${modalAction}`, {
        customerId: customer.id,
        customerName: customer.name,
        reason: modalAction === 'reject' ? rejectionReason : undefined,
      });
    }
    
    setIsModalOpen(false);
    setRejectionReason('');
  };

  const fetchCustomerDetails = async () => {
    if (!customerId) return;
    setLoading(true);
    setError('');
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*, user:users(id)')
        .eq('id', customerId)
        .single();

      if (customerError) throw customerError;

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
        user_id: customerData.user_id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || '',
        status: customerData.status,
        created_at: customerData.created_at,
        id_proof_url: customerData.id_proof_url,
        photo_url: customerData.photo_url,
        groups: (groupMemberships || []).map(membership => ({
          id: membership.chit_group_id,
          name: chitGroupDetailsMap.get(membership.chit_group_id)?.name || 'Unknown Group',
          status: (chitGroupDetailsMap.get(membership.chit_group_id)?.status as 'active' | 'inactive') || 'inactive',
          joined_date: membership.joined_date,
        })),
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
      await log_audit('branch_manager.customer.view', {
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
        {customer?.status === 'pending' && (
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">This customer is pending approval.</p>
              <div className="space-x-2">
                <Button onClick={() => handleActionClick('approve')} variant="default" size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                <Button onClick={() => handleActionClick('reject')} variant="destructive" size="sm">Reject</Button>
              </div>
            </div>
          </div>
        )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Main Details */}
            <div className="md:col-span-2 space-y-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><span className="font-medium text-gray-500">Phone:</span> {customer.phone}</p>
                  <p><span className="font-medium text-gray-500">Address:</span> {customer.address}</p>
                  <p><span className="font-medium text-gray-500">Member Since:</span> {new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Groups Joined */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Groups Joined</h3>
                {customer.groups.length === 0 ? (
                  <p className="text-sm text-gray-500">No groups joined yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {customer.groups.map(group => (
                      <li key={group.id} className="py-2 flex justify-between items-center">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-sm text-gray-500">Joined: {new Date(group.joined_date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column: Documents */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Photo</h3>
                {customer?.photo_url ? (
                  <img src={customer.photo_url} alt="Customer" className="w-32 h-32 rounded-full object-cover shadow-lg" />
                ) : (
                  <p className="text-sm text-gray-500">No photo provided.</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">ID Proof</h3>
                {customer?.id_proof_url ? (
                  <a href={customer.id_proof_url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={customer.id_proof_url} alt="ID Proof" className="w-full rounded-lg object-contain border p-1 hover:border-primary-500 transition-all shadow" />
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No ID proof provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Payments Section (Full Width) */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment History</h3>
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
                            to={`/branch-manager/groups/${payment.chit_group_id}`} 
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
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}</DialogTitle>
            <DialogDescription>
              {modalAction === 'approve' ?
                `Are you sure you want to approve ${customer?.name}?` :
                `Please provide a reason for rejecting ${customer?.name}.`
              }
            </DialogDescription>
          </DialogHeader>
          {modalAction === 'reject' && (
            <div className="grid gap-4 py-4">
              <Label htmlFor="rejection-reason" className="text-left">Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete documentation, failed verification..."
                className="col-span-3"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAction} className={modalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
              Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetail;
