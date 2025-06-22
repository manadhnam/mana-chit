import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, EyeIcon, ArrowDownTrayIcon, UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/solid';
import { Customer } from '@/types/database';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  customer_id: string;
  type: 'id_proof' | 'address_proof' | 'photo';
  file_name: string;
  file_url: string;
  status: 'pending' | 'verified' | 'rejected';
  ocr_data: {
    extracted_text: string;
    confidence_score: number;
    validation_results: {
      field: string;
      value: string;
      is_valid: boolean;
      error_message?: string;
    }[];
  };
  created_at: string;
  updated_at: string;
}

const DocumentVerification = () => {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockDocuments: Document[] = [
        {
          id: '1',
          customer_id: '1',
          type: 'id_proof',
          file_name: 'aadhar.pdf',
          file_url: '/documents/aadhar.pdf',
          status: 'pending',
          ocr_data: {
            extracted_text: 'Name: John Doe\nDOB: 01-01-1990\nAadhar: 1234-5678-9012',
            confidence_score: 0.95,
            validation_results: [
              {
                field: 'name',
                value: 'John Doe',
                is_valid: true,
              },
              {
                field: 'dob',
                value: '01-01-1990',
                is_valid: true,
              },
              {
                field: 'aadhar',
                value: '1234-5678-9012',
                is_valid: true,
              },
            ],
          },
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      // TODO: Implement document verification
      toast.success('Document verified successfully');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to verify document');
    }
  };

  const handleRejectDocument = async (documentId: string) => {
    try {
      // TODO: Implement document rejection
      toast.success('Document rejected');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to reject document');
    }
  };

  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      // TODO: Implement document download
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const getFilteredDocuments = () => {
    if (filter === 'all') return documents;
    return documents.filter((doc) => doc.status === filter);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Document Verification
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Verify customer documents using OCR and validation
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Documents</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Documents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {documents.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Verification
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {documents.filter((d) => d.status === 'pending').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Verified Documents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {documents.filter((d) => d.status === 'verified').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Rejected Documents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {documents.filter((d) => d.status === 'rejected').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Document List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  OCR Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Validation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {getFilteredDocuments().map((document) => (
                <tr key={document.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Customer {document.customer_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {document.type.replace('_', ' ').toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        document.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : document.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {document.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${document.ocr_data.confidence_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(document.ocr_data.confidence_score * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {document.ocr_data.validation_results.every((v) => v.is_valid) ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {document.ocr_data.validation_results.filter((v) => v.is_valid).length}/
                        {document.ocr_data.validation_results.length} valid
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handlePreviewDocument(document)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(document)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-4"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    {document.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerifyDocument(document.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRejectDocument(document.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <ExclamationCircleIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Document Preview
                  </h3>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <ExclamationCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document
                    </h4>
                    <div className="border rounded-lg p-4 h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                      <img
                        src={selectedDocument.file_url}
                        alt={selectedDocument.file_name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OCR Results
                    </h4>
                    <div className="border rounded-lg p-4 h-96 overflow-y-auto">
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Extracted Text
                          </h5>
                          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {selectedDocument.ocr_data.extracted_text}
                          </pre>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Validation Results
                          </h5>
                          <div className="space-y-2">
                            {selectedDocument.ocr_data.validation_results.map((result, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded ${
                                  result.is_valid
                                    ? 'bg-green-50 dark:bg-green-900/20'
                                    : 'bg-red-50 dark:bg-red-900/20'
                                }`}
                              >
                                <div className="flex items-center">
                                  {result.is_valid ? (
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                                  )}
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {result.field}:
                                  </span>
                                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {result.value}
                                  </span>
                                </div>
                                {!result.is_valid && result.error_message && (
                                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {result.error_message}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification; 