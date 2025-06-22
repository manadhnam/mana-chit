import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  UserPlusIcon,
  UserMinusIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import StaffList from '@/components/branch/StaffList';
import { branchService } from '@/services/branchService';
import type { Staff } from '../../types/branch';

const BranchManagerStaffManagement: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (!branchId) return;
        const data = await branchService.getBranchStaff(branchId);
        setStaff(data);
      } catch (err) {
        setError('Failed to fetch staff data');
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [branchId]);

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (staff: Staff) => {
    // Implement delete staff functionality
    console.log('Delete staff:', staff);
  };

  const handleViewDocuments = (staff: Staff) => {
    // Implement view documents functionality
    console.log('View documents for staff:', staff);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage staff members and their roles
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Staff
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {staff.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <UserPlusIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Staff
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {staff.filter((s) => s.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <UserMinusIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive Staff
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {staff.filter((s) => s.status === 'inactive').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staff Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Staff List
          </h2>
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={() => {
              setSelectedStaff(null);
              setIsModalOpen(true);
            }}
          >
            Add Staff
          </button>
        </div>
        <StaffList
          staff={staff}
          loading={loading}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          onViewDocuments={handleViewDocuments}
        />
      </motion.div>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            {/* Add form fields here */}
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                onClick={() => setIsModalOpen(false)}
              >
                {selectedStaff ? 'Save Changes' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagerStaffManagement; 