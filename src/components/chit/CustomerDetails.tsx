
import { motion } from 'framer-motion';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  IdentificationIcon,
  DocumentTextIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/solid';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  village_id: number;
  aadhar_number: string;
  pan_number: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  monthly_income: number;
  status: string;
  documents?: {
    id: string;
    document_type: 'aadhar' | 'pan' | 'income_proof' | 'address_proof' | 'photo' | 'other';
    file_url: string;
    verification_status: 'pending' | 'verified' | 'rejected';
  }[];
}

interface CustomerDetailsProps {
  customer: Customer;
  isLoading?: boolean;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const details = [
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: customer.phone,
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: customer.email,
    },
    {
      icon: HomeIcon,
      label: 'Address',
      value: customer.address,
    },
    {
      icon: IdentificationIcon,
      label: 'Aadhar Number',
      value: customer.aadhar_number,
    },
    {
      icon: IdentificationIcon,
      label: 'PAN Number',
      value: customer.pan_number,
    },
    {
      icon: CalendarIcon,
      label: 'Date of Birth',
      value: new Date(customer.date_of_birth).toLocaleDateString(),
    },
    {
      icon: BriefcaseIcon,
      label: 'Occupation',
      value: customer.occupation,
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Monthly Income',
      value: `₹${customer.monthly_income.toLocaleString()}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <div className="flex items-center space-x-4">
        {customer.documents?.find(doc => doc.document_type === 'photo') ? (
          <img
            src={customer.documents.find(doc => doc.document_type === 'photo')?.file_url}
            alt={customer.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{customer.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-start space-x-3">
            <detail.icon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {detail.label}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>

      {customer.documents && customer.documents.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Documents
          </h4>
          <div className="space-y-2">
            {customer.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    doc.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                    doc.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.verification_status.charAt(0).toUpperCase() + doc.verification_status.slice(1)}
                  </span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}; 