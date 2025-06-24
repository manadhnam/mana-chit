import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { ChitGroup, User } from '@/types/database';
import { 
  ArrowLeftIcon, 
  UserGroupIcon, 
  CurrencyRupeeIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EnrichedMember extends User {
  joined_date: string;
  payment_status: 'paid' | 'pending' | 'overdue';
  last_payment_date?: string;
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<ChitGroup | null>(null);
  const [members, setMembers] = useState<EnrichedMember[]>([]);
  const [totalCollection, setTotalCollection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'start' | 'stop' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleActionClick = (action: 'approve' | 'reject' | 'start' | 'stop') => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!group || !modalAction) return;

    if (modalAction === 'reject' && !rejectionReason.trim()) {
      toast.error('A reason for rejection is required.');
      return;
    }
    
    setLoading(true);
    let newStatus: string;
    
    switch (modalAction) {
      case 'approve':
        newStatus = 'active';
        break;
      case 'reject':
        newStatus = 'cancelled';
        break;
      case 'start':
        newStatus = 'active';
        break;
      case 'stop':
        newStatus = 'completed';
        break;
      default:
        newStatus = group.status;
    }

    const { error } = await supabase
      .from('chit_groups')
      .update({ status: newStatus })
      .eq('id', group.id);

    if (error) {
      toast.error('Failed to update group status.');
    } else {
      toast.success(`Group has been ${modalAction === 'approve' ? 'approved' : modalAction === 'reject' ? 'rejected' : modalAction === 'start' ? 'started' : 'stopped'}.`);
      setGroup({ ...group, status: newStatus as any });
    }
    
    setLoading(false);
    setIsModalOpen(false);
    setRejectionReason('');
  };

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);

    try {
      // 1. Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('chit_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      if (groupError) throw groupError;
      setGroup(groupData);

      // 2. Fetch members with proper join
      const { data: memberLinks, error: memberError } = await supabase
        .from('chit_group_members')
        .select(`
          user_id,
          joined_date,
          user:users (
            id,
            name,
            email,
            mobile,
            status
          )
        `)
        .eq('chit_group_id', groupId);
      if (memberError) throw memberError;

      const enrichedMembers: EnrichedMember[] = memberLinks.map(m => {
        const userObject = Array.isArray(m.user) ? m.user[0] : m.user;
        return {
          ...(userObject as User),
          joined_date: m.joined_date,
          payment_status: 'paid' as const, // TODO: Implement real payment status
          last_payment_date: undefined
        };
      });
      setMembers(enrichedMembers);

      // 3. Fetch total collection from collections table
      const { data: collections, error: collectionError } = await supabase
        .from('collections')
        .select('amount')
        .eq('chit_group_id', groupId);

      if (collectionError) throw collectionError;
      
      const total = collections?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      setTotalCollection(total);

    } catch (error: any) {
      toast.error('Failed to fetch group details: ' + error.message);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading group details...</div>;
  if (!group) return <div className="p-8 text-center text-red-500">Group not found or failed to load.</div>;
  
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const monthlyInstallment = group.max_members > 0 ? group.chit_value / group.max_members : 0;
  const totalCommission = (group.chit_value * group.commission_percentage) / 100;
  const monthlyCollection = monthlyInstallment * group.max_members;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to="/branch-manager/groups"
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Group List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Header with Status and Actions */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.group_name}</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created on {formatDate(group.created_at)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${statusColor[group.status]}`}>
                    {group.status}
                  </span>
                  {group.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button onClick={() => handleActionClick('approve')} size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button onClick={() => handleActionClick('reject')} size="sm" variant="destructive">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {group.status === 'active' && (
                    <Button onClick={() => handleActionClick('stop')} size="sm" variant="outline">
                      <StopIcon className="h-4 w-4 mr-1" />
                      Stop Group
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Financial Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chit Value</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(group.chit_value)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Installment</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlyInstallment)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Commission</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalCommission)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Monthly Collection</p>
                  <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{formatCurrency(monthlyCollection)}</p>
                </div>
              </div>
            </div>

            {/* Group Details */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Group Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{members.length} / {group.max_members}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{group.duration} months</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatDate(group.start_date ?? '')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Members ({members.length})</h2>
                <Link
                  to={`/branch-manager/groups/${groupId}/members`}
                  className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                >
                  View All Members →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {members.slice(0, 5).map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(member.joined_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            member.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {member.payment_status.charAt(0).toUpperCase() + member.payment_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/branch-manager/customers/${member.id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No members have joined this group yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/branch-manager/groups/${groupId}/members`}
                className="flex items-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 mr-3" />
                Manage Members
              </Link>
              <Link
                to={`/branch-manager/groups/${groupId}/auctions`}
                className="flex items-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <CurrencyRupeeIcon className="h-5 w-5 mr-3" />
                View Auctions
              </Link>
              <Link
                to={`/branch-manager/groups/${groupId}/collections`}
                className="flex items-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Collections Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {modalAction === 'approve' ? 'Approval' : modalAction === 'reject' ? 'Rejection' : modalAction === 'start' ? 'Start' : 'Stop'}</DialogTitle>
            <DialogDescription>
              {modalAction === 'approve' ?
                `Are you sure you want to approve the group "${group.group_name}"?` :
                modalAction === 'reject' ?
                `Please provide a reason for rejecting the group "${group.group_name}".` :
                modalAction === 'start' ?
                `Are you sure you want to start the group "${group.group_name}"?` :
                `Are you sure you want to stop the group "${group.group_name}"?`
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
                placeholder="e.g., Insufficient members, invalid terms..."
                className="col-span-3"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirmAction} 
              className={
                modalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 
                modalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                'bg-primary-600 hover:bg-primary-700'
              }
            >
              Confirm {modalAction === 'approve' ? 'Approval' : modalAction === 'reject' ? 'Rejection' : modalAction === 'start' ? 'Start' : 'Stop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDetail;