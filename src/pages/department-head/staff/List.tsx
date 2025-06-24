import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabaseClient';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  performance: number;
  department: string;
}

const StaffList = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Senior Agent',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      status: 'active',
      joinDate: '2023-01-15',
      performance: 92,
      department: 'Sales'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Agent',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      status: 'active',
      joinDate: '2023-03-20',
      performance: 88,
      department: 'Sales'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'Junior Agent',
      email: 'mike.johnson@example.com',
      phone: '+91 9876543212',
      status: 'on_leave',
      joinDate: '2023-06-10',
      performance: 85,
      department: 'Sales'
    }
  ]);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'active',
    joinDate: '',
    performance: 80,
    department: user?.department_id || ''
  });
  const [department, setDepartment] = useState('');

  useEffect(() => {
    // Fetch department from Department Head's profile
    const fetchDepartment = async () => {
      if (user?.department_id) {
        const { data } = await supabase.from('departments').select('name').eq('id', user.department_id).single();
        if (data) setDepartment(data.name);
        setNewStaff(s => ({ ...s, department: user.department_id || '' }));
      }
    };
    fetchDepartment();
  }, [user]);

  const filteredStaff = staffList.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    toast.success('Edit functionality will be implemented');
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Implement delete functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error('Failed to delete staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.email || !newStaff.phone || !newStaff.joinDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    // Save staff with department assignment
    await supabase.from('users').insert({
      name: newStaff.name,
      email: newStaff.email,
      mobile: newStaff.phone,
      role: newStaff.role,
      department_id: user?.department_id,
      status: newStaff.status,
      join_date: newStaff.joinDate,
    });
    setLoading(false);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', role: '', email: '', phone: '', status: 'active', joinDate: '', performance: 80, department: user?.department_id || '' });
    toast.success('Staff member added successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Staff Management
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and monitor your department staff
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Staff</Dialog.Title>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <input type="text" value={newStaff.name} onChange={e => setNewStaff(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role *</label>
                <select value={newStaff.role} onChange={e => setNewStaff(s => ({ ...s, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" required>
                  <option value="">Select Role</option>
                  <option value="agent">Agent</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input type="email" value={newStaff.email} onChange={e => setNewStaff(s => ({ ...s, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                <input type="tel" value={newStaff.phone} onChange={e => setNewStaff(s => ({ ...s, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
                <select value={newStaff.status} onChange={e => setNewStaff(s => ({ ...s, status: e.target.value as StaffMember['status'] }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Join Date *</label>
                <input type="date" value={newStaff.joinDate} onChange={e => setNewStaff(s => ({ ...s, joinDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Performance (%)</label>
                <input type="number" min={0} max={100} value={newStaff.performance} onChange={e => setNewStaff(s => ({ ...s, performance: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                <input type="text" value={department} disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStaff.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserGroupIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {member.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {member.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {member.performance}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default StaffList; 