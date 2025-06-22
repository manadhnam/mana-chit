import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentCheckIcon } from '@heroicons/react/24/solid';


interface Document {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadDate: string;
  verificationDate?: string;
  verificationComment?: string;
}

interface LoanDocumentsProps {
  loanId: string;
  userId: string;
}

const LoanDocuments = ({ loanId, userId }: LoanDocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [loanId, userId]);

  const fetchDocuments = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Identity Proof',
          type: 'Aadhar Card',
          status: 'VERIFIED',
          uploadDate: '2024-03-01',
          verificationDate: '2024-03-02',
          verificationComment: 'Document verified successfully',
        },
        {
          id: '2',
          name: 'Address Proof',
          type: 'Utility Bill',
          status: 'PENDING',
          uploadDate: '2024-03-01',
        },
        {
          id: '3',
          name: 'Income Proof',
          type: 'Salary Slip',
          status: 'REJECTED',
          uploadDate: '2024-03-01',
          verificationDate: '2024-03-02',
          verificationComment: 'Document is not clear, please upload a better quality image',
        },
      ];

      setDocuments(mockDocuments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch documents');
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument: Document = {
        id: String(documents.length + 1),
        name: selectedFile.name,
        type: selectedFile.type,
        status: 'PENDING',
        uploadDate: new Date().toISOString(),
      };

      setDocuments([...documents, newDocument]);
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'VERIFIED':
        return <DocumentCheckIcon className="h-6 w-6 text-green-500" />;
      case 'REJECTED':
        return <DocumentXMarkIcon className="h-6 w-6 text-red-500" />;
      case 'PENDING':
        return <DocumentArrowUpIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Documents</h2>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                !selectedFile || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.verificationDate ? new Date(doc.verificationDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {doc.verificationComment || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default LoanDocuments; 