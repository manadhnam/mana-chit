import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import StaffList from '@/components/branch/StaffList';
import { branchService } from '@/services/branchService';
import type { Staff } from '../../types/branch';

const BranchStaffManagement: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Implement edit staff functionality
    console.log('Edit staff:', staff);
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
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Branch Staff Management</h1>
        <StaffList
          staff={staff}
          loading={loading}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          onViewDocuments={handleViewDocuments}
        />
      </motion.div>
    </div>
  );
};

export default BranchStaffManagement; 