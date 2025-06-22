import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CustomerList } from '@/components/branch/CustomerList';
import { branchService } from '@/services/branchService';
import type { Customer } from '@/types/branch';

const BranchCustomerManagement: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!branchId) return;
        const data = await branchService.getBranchCustomers(branchId);
        setCustomers(data);
      } catch (err) {
        setError('Failed to fetch customer data');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [branchId]);

  const handleEditCustomer = (customer: Customer) => {
    // Implement edit customer functionality
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    // Implement delete customer functionality
    console.log('Delete customer:', customer);
  };

  const handleViewDocuments = (customer: Customer) => {
    // Implement view documents functionality
    console.log('View documents for customer:', customer);
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
        <h1 className="text-2xl font-bold mb-4">Branch Customer Management</h1>
        <CustomerList
          customers={customers}
          loading={loading}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onViewDocuments={handleViewDocuments}
        />
      </motion.div>
    </div>
  );
};

export default BranchCustomerManagement; 