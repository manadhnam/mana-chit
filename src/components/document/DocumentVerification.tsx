import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuditStore } from '@/store/auditStore';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationCircleIcon, DocumentIcon } from '@heroicons/react/24/solid';


interface DocumentVerificationProps {
  userId: string;
  onVerificationComplete: () => void;
}

const DocumentVerification = ({ userId, onVerificationComplete }: DocumentVerificationProps) => {
  const { documents, currentDocument, fetchUserDocuments, verifyDocument, isLoading, error } = useDocumentStore();
  const { createNotification } = useNotificationStore();
  const { logAction } = useAuditStore();
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchUserDocuments(userId);
  }, [userId, fetchUserDocuments]);

  const handleVerify = async (status: 'VERIFIED' | 'REJECTED') => {
    if (!currentDocument) return;
    
    try {
      await verifyDocument(currentDocument.id, status, status === 'REJECTED' ? rejectionReason : undefined);
      await createNotification({
        userId,
        type: 'info',
        title: `Document ${status.toLowerCase()}`,
        message: `Your ${currentDocument.type.toLowerCase().replace('_', ' ')} has been ${status.toLowerCase()}.`,
      });
      await logAction({
        userId,
        userRole: 'VERIFIER',
        action: `VERIFY_DOCUMENT_${status}`,
        module: 'DOCUMENT',
        details: { documentId: currentDocument.id, type: currentDocument.type, status },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });
      onVerificationComplete();
    } catch (error) {
      console.error('Failed to verify document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="flex">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents</h3>
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{document.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Type: {document.type.replace('_', ' ')}
                </p>
                {document.expiryDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires: {new Date(document.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 ml-4">
                {document.status === 'VERIFIED' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : document.status === 'REJECTED' ? (
                  <XCircleIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Actions */}
      {currentDocument && currentDocument.status === 'PENDING' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Verification Actions</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rejection Reason (if applicable)
              </label>
              <textarea
                id="rejectionReason"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerify('VERIFIED')}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerify('REJECTED')}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reject
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification; 