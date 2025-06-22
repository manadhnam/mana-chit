import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { ChitGroup, User } from '@/types/database';
import { ArrowLeftIcon, UserGroupIcon, CurrencyRupeeIcon } from '@heroicons/react/24/solid';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface EnrichedMember extends User {
  paymentStatus: string; // This will be simplified for now
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<ChitGroup | null>(null);
  const [members, setMembers] = useState<EnrichedMember[]>([]);
  const [totalCollection, setTotalCollection] = useState(0);
  const [loading, setLoading] = useState(true);

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

      // 2. Fetch members
      const { data: memberLinks, error: memberError } = await supabase
        .from('chit_members')
        .select('user_id')
        .eq('chit_group_id', groupId);
      if (memberError) throw memberError;

      const memberIds = memberLinks.map(m => m.user_id);
      if (memberIds.length > 0) {
        const { data: memberData, error: userError } = await supabase
          .from('users')
          .select('*')
          .in('id', memberIds);
        if (userError) throw userError;
        
        // This is a simplification. Real payment status would be more complex.
        const enrichedMembers = memberData.map(m => ({ ...m, paymentStatus: 'Paid' }));
        setMembers(enrichedMembers);
      } else {
        setMembers([]);
      }

      // 3. Fetch total collection
      const { data: contributions, error: contributionError } = await supabase
        .from('contributions')
        .select('amount')
        .eq('chit_group_id', groupId);

      if (contributionError) throw contributionError;
      
      const total = contributions.reduce((acc, curr) => acc + curr.amount, 0);
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

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to="/branch-manager/groups"
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Group List
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.group_name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Created on {formatDate(group.created_at)}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${statusColor[group.status]}`}
            >
              {group.status}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <CurrencyRupeeIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chit Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(group.chit_value)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserGroupIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{members.length} / {group.max_members}</p>
            </div>
          </div>
           <div className="flex items-center space-x-4">
            <CurrencyRupeeIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Collection</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalCollection)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Members List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mobile</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {members.length > 0 ? members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.paymentStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/branch-manager/customers/${member.id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No members have joined this group yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;