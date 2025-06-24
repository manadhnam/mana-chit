import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  PlusIcon,
  XCircleIcon,
  EyeIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { ChitGroup, ChitGroupStatus } from '@/types/database';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency, formatDate } from '@/utils/formatters';

// Define a type for our enriched group data
type EnrichedChitGroup = ChitGroup & { member_count: number };

const GroupList = () => {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState<EnrichedChitGroup[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const fetchGroupsAndStats = useCallback(async () => {
    if (!user?.branch_id) return;
    setLoading(true);
    
    try {
        let query = supabase
            .from('chit_groups')
            .select('*', { count: 'exact' })
            .eq('branch_id', user.branch_id);

        if (debouncedSearch) {
            query = query.ilike('group_name', `%${debouncedSearch}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // For now, use current_cycle as a placeholder for member count
        // TODO: Implement proper member count fetching
        const enrichedGroups = (data || []).map(group => ({
            ...group,
            member_count: group.current_cycle || 0
        }));

        setGroups(enrichedGroups);
        
        // Stats can still be fetched separately for simplicity and accuracy
        const { count: totalCount } = await supabase.from('chit_groups').select('*', { count: 'exact', head: true }).eq('branch_id', user.branch_id);
        const { count: activeCount } = await supabase.from('chit_groups').select('*', { count: 'exact', head: true }).eq('branch_id', user.branch_id).eq('status', 'active');
        const { count: pendingCount } = await supabase.from('chit_groups').select('*', { count: 'exact', head: true }).eq('branch_id', user.branch_id).eq('status', 'pending');

        setStats({
            total: totalCount ?? 0,
            active: activeCount ?? 0,
            pending: pendingCount ?? 0,
        });

    } catch (error: any) {
        toast.error('Failed to fetch groups: ' + error.message);
    } finally {
        setLoading(false);
    }
  }, [user?.branch_id, debouncedSearch]);


  useEffect(() => {
    fetchGroupsAndStats();
  }, [fetchGroupsAndStats]);

  const updateGroupStatus = async (id: string, status: ChitGroupStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      const { error } = await supabase
        .from('chit_groups')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Group status updated successfully!', { id: toastId });
      fetchGroupsAndStats();
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chit Groups</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage all chit groups in your branch.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/branch-manager/chit-groups/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Group
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Total Groups</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Pending</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="block w-full sm:w-64 border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search groups..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : groups.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No groups found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Group</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Chit Value</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Members</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Installment</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Start Date</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">View</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {groups.map(g => (
                    <tr key={g.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{g.group_name}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{formatCurrency(g.chit_value)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{g.member_count}/{g.max_members}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{formatCurrency(g.max_members > 0 ? g.chit_value / g.max_members : 0)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(g.start_date ?? '')}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          g.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          g.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          g.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/branch-manager/groups/${g.id}`} className="text-primary-600 hover:text-primary-900" title="View Details">
                          View
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
    </div>
  );
};

export default GroupList; 