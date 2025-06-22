
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  village_id: string;
  aadhar_number: string;
  pan_number: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  monthly_income: number;
  status: 'active' | 'inactive';
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    [key: string]: any;
  }[];
  created_at: string;
  updated_at: string;
}

interface CustomerListProps {
  customers: Customer[];
  loading?: boolean;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onViewDocuments?: (customer: Customer) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  loading,
  onEdit,
  onDelete,
  onViewDocuments,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No customers found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by adding a new customer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer, index) => (
        <motion.div
          key={customer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {customer.name}
                </h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {customer.address}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {customer.status === 'active' ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mr-1" />
                )}
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
              {onViewDocuments && (
                <button
                  onClick={() => onViewDocuments(customer)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title="View Documents"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(customer)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title="Edit Customer"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(customer)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-300"
                  title="Delete Customer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Aadhar:</span> {customer.aadhar_number}
            </div>
            <div>
              <span className="font-medium">PAN:</span> {customer.pan_number}
            </div>
            <div>
              <span className="font-medium">DOB:</span>{' '}
              {new Date(customer.date_of_birth).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Income:</span>{' '}
              {formatCurrency(customer.monthly_income)}
            </div>
          </div>
          {customer.documents && customer.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Documents
              </h4>
              <div className="flex flex-wrap gap-2">
                {customer.documents.map((doc) => (
                  <span
                    key={doc.type}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {doc.type}
                    {doc.verified ? (
                      <CheckCircleIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 ml-1" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}; 