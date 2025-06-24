import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { ChitGroup, User } from '@/types/database';
import { ArrowLeftIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';

const GroupMembers = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user: authUser } = useAuthStore();
  const [group, setGroup] = useState<ChitGroup | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState<User[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchMembers = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('chit_groups')
        .select('group_name')
        .eq('id', groupId)
        .single();
      if (groupError) throw groupError;
      setGroup(groupData as any);

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
        setMembers(memberData);
      } else {
        setMembers([]);
      }
    } catch (error: any) {
      toast.error('Failed to fetch members: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openAddMemberModal = async () => {
    if (!authUser?.branch_id) {
      toast.error('Branch information not found.');
      return;
    }
    setIsModalOpen(true);
    setLoadingModal(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('branch_id', authUser.branch_id)
        .eq('role', 'user');

      if (error) throw error;
      
      const memberIds = members.map(m => m.id);
      const available = data.filter(c => !memberIds.includes(c.id));
      setAvailableCustomers(available);

    } catch (error: any) {
      toast.error('Failed to fetch customers: ' + error.message);
    } finally {
      setLoadingModal(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return availableCustomers.filter(c => 
      c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [availableCustomers, debouncedSearchTerm]);

  const handleAddMember = async (customer: User) => {
    if (!groupId) return;
    if (members.length >= (group?.max_members || 0)) {
        toast.error('This group is already full.');
        return;
    }

    const toastId = toast.loading(`Adding ${customer.name}...`);
    try {
      const { error } = await supabase.from('chit_members').insert({
        chit_group_id: groupId,
        user_id: customer.id,
      });

      if (error) throw error;
      
      toast.success(`${customer.name} has been added to the group.`, { id: toastId });
      setIsModalOpen(false);
      fetchMembers(); // Refetch members to update the list
    } catch (error: any) {
      toast.error(`Failed to add member: ${error.message}`, { id: toastId });
    }
  };
  
  const handleRemoveMember = async (member: User) => {
    if (!groupId) return;
    if (!window.confirm(`Are you sure you want to remove ${member.name} from this group?`)) return;

    const toastId = toast.loading(`Removing ${member.name}...`);
    try {
        const { error } = await supabase
            .from('chit_members')
            .delete()
            .eq('chit_group_id', groupId)
            .eq('user_id', member.id);
        
        if (error) throw error;

        toast.success(`${member.name} has been removed from the group.`, { id: toastId });
        fetchMembers(); // Refetch
    } catch (error: any) {
        toast.error(`Failed to remove member: ${error.message}`, { id: toastId });
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            to={`/branch-manager/groups/${groupId}`}
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Group Details
          </Link>
        </div>

        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {group?.group_name || 'Group'} Members
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              A list of all the members in this chit group.
            </p>
          </div>
          <button
            onClick={openAddMemberModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading members...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mobile</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.mobile}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                            title={`Remove ${member.name}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No members yet. Click "Add Member" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Member to {group?.group_name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              {loadingModal ? (
                <div className="text-center p-8">Loading customers...</div>
              ) : (
                <ul className="h-72 overflow-y-auto divide-y dark:divide-gray-700">
                  {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
                    <li key={customer.id} className="flex justify-between items-center py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                      </div>
                      <button
                        onClick={() => handleAddMember(customer)}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700"
                      >
                        Add
                      </button>
                    </li>
                  )) : (
                    <li className="text-center py-8 text-gray-500 dark:text-gray-400">No available customers found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMembers;
