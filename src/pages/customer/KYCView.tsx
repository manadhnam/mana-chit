import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';


interface KYCInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  documents: {
    id: string;
    type: string;
    status: 'verified' | 'pending' | 'rejected';
    uploadedAt: string;
    url?: string;
  }[];
  status: 'verified' | 'pending' | 'rejected';
  lastUpdated: string;
}

const mockKYC: KYCInfo = {
  id: 'KYC001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  address: '123 Main St, City, State, 123456',
  documents: [
    { id: 'DOC001', type: 'Aadhar Card', status: 'verified', uploadedAt: '2024-01-01', url: 'https://example.com/aadhar.pdf' },
    { id: 'DOC002', type: 'PAN Card', status: 'verified', uploadedAt: '2024-01-01', url: 'https://example.com/pan.pdf' },
    { id: 'DOC003', type: 'Address Proof', status: 'pending', uploadedAt: '2024-01-01' },
  ],
  status: 'pending',
  lastUpdated: '2024-01-01',
};

const KYCView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [kyc, setKYC] = useState<KYCInfo | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setKYC(mockKYC);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading KYC details...</p>
        </div>
      ) : kyc ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KYC Details</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-gray-900 dark:text-white font-medium">{kyc.address}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {kyc.documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                      <DocumentIcon className="h-5 w-5 mr-2 text-primary-500" />
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.status === 'verified' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircleIcon className="h-4 w-4 mr-1" /> Verified
                        </span>
                      ) : doc.status === 'pending' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <XCircleIcon className="h-4 w-4 mr-1" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">
                          View
                        </a>
                      ) : (
                        <button className="text-primary-600 hover:underline dark:text-primary-400">Upload</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">KYC details not found.</p>
        </div>
      )}
    </div>
  );
};

export default KYCView; 