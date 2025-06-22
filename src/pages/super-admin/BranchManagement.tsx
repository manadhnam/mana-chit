
import BranchManagement from '@/components/branch/BranchManagement';

const BranchManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branch Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all branches, their staff, and performance
        </p>
      </div>
      <BranchManagement />
    </div>
  );
};

export default BranchManagementPage; 