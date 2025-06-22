
import { motion } from 'framer-motion';
import {
  UserIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import type { Staff } from '@/types/branch';

interface StaffListProps {
  staff: Staff[];
  loading?: boolean;
  onEdit?: (staff: Staff) => void;
  onDelete?: (staff: Staff) => void;
  onViewDocuments?: (staff: Staff) => void;
}

const StaffList: React.FC<StaffListProps> = ({
  staff,
  loading = false,
  onEdit,
  onDelete,
  onViewDocuments,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No staff members found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {staff.map((member) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Role: {member.role}</p>
                <p>Joined: {formatDate(member.joined_at)}</p>
                {member.last_active && (
                  <p>Last Active: {formatDate(member.last_active)}</p>
                )}
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewDocuments?.(member)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                title="View Documents"
              >
                <DocumentTextIcon className="h-5 w-5" />
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(member)}
                  className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit Staff"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(member)}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete Staff"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffList; 