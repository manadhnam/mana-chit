import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  performance: {
    loansProcessed: number;
    recoveryRate: number;
    customerSatisfaction: number;
  };
}

const BranchStaffManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaffMember, setNewStaffMember] = useState({
    name: '',
    role: '',
    branch: '',
  });

  // Mock data loading
  useEffect(() => {
    const mockStaff: StaffMember[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        role: 'Loan Officer',
        branch: 'Main Branch',
        performance: {
          loansProcessed: 45,
          recoveryRate: 95,
          customerSatisfaction: 92,
        },
      },
      {
        id: '2',
        name: 'Priya Sharma',
        role: 'Customer Service',
        branch: 'Main Branch',
        performance: {
          loansProcessed: 30,
          recoveryRate: 88,
          customerSatisfaction: 95,
        },
      },
      {
        id: '3',
        name: 'Amit Patel',
        role: 'Loan Officer',
        branch: 'Main Branch',
        performance: {
          loansProcessed: 38,
          recoveryRate: 92,
          customerSatisfaction: 90,
        },
      },
    ];

    setTimeout(() => {
      setStaff(mockStaff);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = () => {
    if (!newStaffMember.name || !newStaffMember.role || !newStaffMember.branch) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMember: StaffMember = {
      id: Date.now().toString(),
      ...newStaffMember,
      performance: {
        loansProcessed: 0,
        recoveryRate: 0,
        customerSatisfaction: 0,
      },
    };

    setStaff([...staff, newMember]);
    setShowAddModal(false);
    setNewStaffMember({ name: '', role: '', branch: '' });
    toast.success('Staff member added successfully');
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
    toast.success('Staff member removed successfully');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Branch Staff Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your branch staff and their performance
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Loan Officer">Loan Officers</option>
              <option value="Customer Service">Customer Service</option>
            </select>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
                    <UserGroupIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => toast.success('Edit functionality coming soon')}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteStaff(member.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Loans Processed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.performance.loansProcessed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(member.performance.loansProcessed / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recovery Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.performance.recoveryRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-secondary-600 h-2 rounded-full"
                      style={{ width: `${member.performance.recoveryRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.performance.customerSatisfaction}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-accent-600 h-2 rounded-full"
                      style={{ width: `${member.performance.customerSatisfaction}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add New Staff Member
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800"
                  value={newStaffMember.name}
                  onChange={(e) => setNewStaffMember({ ...newStaffMember, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800"
                  value={newStaffMember.role}
                  onChange={(e) => setNewStaffMember({ ...newStaffMember, role: e.target.value })}
                >
                  <option value="">Select a role</option>
                  <option value="Loan Officer">Loan Officer</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-800"
                  value={newStaffMember.branch}
                  onChange={(e) => setNewStaffMember({ ...newStaffMember, branch: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleAddStaff}
              >
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchStaffManagement; 