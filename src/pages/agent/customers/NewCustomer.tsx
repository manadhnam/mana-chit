import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CustomerForm } from '@/components/chit/CustomerForm';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const NewCustomer = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSuccess = () => {
    toast.success('Customer added and submitted for approval!');
    navigate('/agent/customers');
  };

  const branch_id = user?.branch_id;

  if (!branch_id) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error: Branch Information Missing</AlertTitle>
          <AlertDescription>
            Could not determine your branch. Please re-login or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Add New Customer
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to onboard a new customer.
          </p>
        </div>
        <div className="p-6">
          <CustomerForm branchId={branch_id} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default NewCustomer; 