
import BranchManagement from '@/components/branch/BranchManagement';

const MandalHeadBranchManagementPage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branch Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage and monitor all branches under your mandal
          </p>
        </div>
      </div>
      <BranchManagement />
    </div>
  );
};

export default MandalHeadBranchManagementPage; 