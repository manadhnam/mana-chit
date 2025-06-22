
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  DocumentTextIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { Collection } from '@/types/branch';

interface CollectionListProps {
  collections: Collection[];
  loading?: boolean;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
  onViewDocuments?: (collection: Collection) => void;
  onViewCustomer?: (collection: Collection) => void;
}

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  loading = false,
  onEdit,
  onDelete,
  onViewDocuments,
  onViewCustomer,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Collection['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method: Collection['payment_method']) => {
    switch (method) {
      case 'cash':
        return <BanknotesIcon className="h-5 w-5" />;
      case 'bank_transfer':
        return <BanknotesIcon className="h-5 w-5" />;
      case 'upi':
        return <BanknotesIcon className="h-5 w-5" />;
      case 'cheque':
        return <DocumentTextIcon className="h-5 w-5" />;
      default:
        return <BanknotesIcon className="h-5 w-5" />;
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

  if (collections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No collections found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {collection.customer_name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    collection.status
                  )}`}
                >
                  {collection.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Amount: {formatCurrency(collection.amount)}</p>
                <p>Payment Date: {formatDate(collection.payment_date)}</p>
                <p>Due Date: {formatDate(collection.due_date)}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getPaymentMethodIcon(collection.payment_method)}
                  <span className="capitalize">{collection.payment_method}</span>
                  {collection.reference_number && (
                    <span className="text-gray-500">
                      (Ref: {collection.reference_number})
                    </span>
                  )}
                </div>
                {collection.notes && (
                  <p className="mt-1 text-gray-500">{collection.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewCustomer?.(collection)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                title="View Customer"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewDocuments?.(collection)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                title="View Documents"
              >
                <DocumentTextIcon className="h-5 w-5" />
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(collection)}
                  className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit Collection"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(collection)}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete Collection"
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

export default CollectionList; 