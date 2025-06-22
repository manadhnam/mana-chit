import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  performance: number;
}

const StaffList = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'active',
    joinDate: '',
    performance: 0,
  });

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          name: 'John Doe',
          role: 'Field Agent',
          email: 'john@example.com',
          phone: '+91 9876543210',
          status: 'active',
          joinDate: '2023-01-15',
          performance: 85,
        },
        {
          id: '2',
          name: 'Jane Smith',
          role: 'Loan Officer',
          email: 'jane@example.com',
          phone: '+91 9876543211',
          status: 'active',
          joinDate: '2023-02-20',
          performance: 92,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          role: 'Field Agent',
          email: 'mike@example.com',
          phone: '+91 9876543212',
          status: 'on_leave',
          joinDate: '2023-03-10',
          performance: 78,
        },
      ];
      setStaff(mockStaff);
    } catch (error) {
      toast.error('Failed to fetch staff data');
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast.success('Edit functionality to be implemented');
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    toast.success('Delete functionality to be implemented');
  };

  const handleAddStaff = () => {
    setIsAddModalOpen(true);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.email || !newStaff.phone || !newStaff.joinDate) {
      toast.error('Please fill all required fields');
      return;
    }
    const newMember: StaffMember = {
      id: Date.now().toString(),
      name: newStaff.name!,
      role: newStaff.role!,
      email: newStaff.email!,
      phone: newStaff.phone!,
      status: (newStaff.status as StaffMember['status']) || 'active',
      joinDate: newStaff.joinDate!,
      performance: newStaff.performance || 0,
    };
    setStaff([...staff, newMember]);
    setIsAddModalOpen(false);
    setNewStaff({ name: '', role: '', email: '', phone: '', status: 'active', joinDate: '', performance: 0 });
    toast.success('Staff member added successfully');
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
                Manage your mandal staff members
              </p>
            </div>
            <button
              onClick={handleAddStaff}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-20">
            <Dialog.Title className="text-lg font-bold mb-4">Add Staff Member</Dialog.Title>
            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border rounded p-2" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} required />
              <input type="text" placeholder="Role" className="w-full border rounded p-2" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} required />
              <input type="email" placeholder="Email" className="w-full border rounded p-2" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
              <input type="tel" placeholder="Phone" className="w-full border rounded p-2" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} required />
              <select className="w-full border rounded p-2" value={newStaff.status} onChange={e => setNewStaff({ ...newStaff, status: e.target.value as StaffMember['status'] })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
              <input type="date" className="w-full border rounded p-2" value={newStaff.joinDate} onChange={e => setNewStaff({ ...newStaff, joinDate: e.target.value })} required />
              <input type="number" placeholder="Performance" className="w-full border rounded p-2" value={newStaff.performance} onChange={e => setNewStaff({ ...newStaff, performance: Number(e.target.value) })} min={0} max={100} />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white">Add</button>
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{member.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : member.status === 'on_leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{member.performance}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={handleEdit}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-900"
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