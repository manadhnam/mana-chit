import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoanList } from '@/components/branch/LoanList';
import { branchService } from '@/services/branchService';
import type { Loan } from '@/types/branch';

const BranchLoanManagement: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        if (!branchId) return;
        const data = await branchService.getBranchLoans(branchId);
        setLoans(data);
      } catch (err) {
        setError('Failed to fetch loan data');
        console.error('Error fetching loans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [branchId]);

  const handleEditLoan = (loan: Loan) => {
    // Implement edit loan functionality
    console.log('Edit loan:', loan);
  };

  const handleDeleteLoan = (loan: Loan) => {
    // Implement delete loan functionality
    console.log('Delete loan:', loan);
  };

  const handleViewDocuments = (loan: Loan) => {
    // Implement view documents functionality
    console.log('View documents for loan:', loan);
  };

  const handleViewPayments = (loan: Loan) => {
    // Implement view payments functionality
    console.log('View payments for loan:', loan);
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
        <h1 className="text-2xl font-bold mb-4">Branch Loan Management</h1>
        <LoanList
          loans={loans}
          loading={loading}
          onEdit={handleEditLoan}
          onDelete={handleDeleteLoan}
          onViewDocuments={handleViewDocuments}
          onViewPayments={handleViewPayments}
        />
      </motion.div>
    </div>
  );
};

export default BranchLoanManagement; 