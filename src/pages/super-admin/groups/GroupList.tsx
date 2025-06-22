import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { ChitGroup, Branch } from '@/types/database';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
// We will create this modal in the next step
import GroupFormModal from './GroupFormModal'; 

type GroupMemberCount = {
  group_id: string;
  member_count: number;
}

type GroupWithDetails = ChitGroup & {
  branch_name: string;
  member_count: number;
};

const GroupList = () => {
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<ChitGroup | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('chit_groups')
        .select(`
          *,
          branches (name)
        `);

      if (groupsError) throw new Error(`Failed to fetch groups: ${groupsError.message}`);

      const { data: memberCounts, error: countError } = await supabase
        .rpc('get_group_member_counts');
      
      if (countError) throw new Error(`Failed to fetch member counts: ${countError.message}`);

      const memberCountMap = new Map((memberCounts as GroupMemberCount[]).map(item => [item.group_id, item.member_count]));

      const detailedGroups: GroupWithDetails[] = (groupsData as any[]).map(group => ({
        ...group,
        branch_name: group.branches?.name || 'N/A',
        member_count: memberCountMap.get(group.id) || 0,
      }));

      setGroups(detailedGroups);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to load groups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSuccess = () => {
    fetchGroups();
    setIsModalOpen(false);
  };
  
  const handleAddNew = () => {
    setGroupToEdit(null);
    setIsModalOpen(true);
  };

  const filteredGroups = useMemo(() => {
    return groups.filter(g => 
      g.group_name.toLowerCase().includes(search.toLowerCase()) ||
      g.branch_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  const activeGroups = useMemo(() => groups.filter(g => g.status === 'active').length, [groups]);
  const completedGroups = useMemo(() => groups.filter(g => g.status === 'completed').length, [groups]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chit Groups</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Manage all chit groups across all branches.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4"><div className="text-gray-500 text-sm">Total Groups</div><div className="text-2xl font-bold">{groups.length}</div></div>
        <div className="bg-white rounded shadow p-4"><div className="text-gray-500 text-sm">Active</div><div className="text-2xl font-bold text-green-600">{activeGroups}</div></div>
        <div className="bg-white rounded shadow p-4"><div className="text-gray-500 text-sm">Completed</div><div className="text-2xl font-bold text-blue-600">{completedGroups}</div></div>
      </div>

      <div className="mb-4">
        <input
          className="border rounded px-3 py-2 w-full md:w-1/3"
          placeholder="Search by name or branch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGroups.map(g => (
                <tr key={g.id}>
                  <td className="px-6 py-4 font-medium">{g.group_name}</td>
                  <td className="px-6 py-4">{g.branch_name}</td>
                  <td className="px-6 py-4">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(g.chit_value)}</td>
                  <td className="px-6 py-4">{g.member_count} / {g.max_members}</td>
                  <td className="px-6 py-4">{g.status}</td>
                  <td className="px-6 py-4">
                    <Link to={`/super-admin/groups/${g.id}`} className="text-primary-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <GroupFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        groupToEdit={groupToEdit}
      />
    </div>
  );
};

export default GroupList; 