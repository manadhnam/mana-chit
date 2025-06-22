import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, DocumentTextIcon, CheckCircleIcon, BanknotesIcon } from '@heroicons/react/24/solid';



interface LoanDetails {
  id: string;
  chitGroupId: string;
  chitGroupName: string;
  amount: number;
  purpose: string;
  duration: number;
  monthlyIncome: number;
  employmentType: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'closed';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  closedDate?: string;
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  repayments: {
    id: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    paidDate?: string;
  }[];
}

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loan, setLoan] = useState<LoanDetails | null>(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: LoanDetails = {
          id: 'LOAN001',
          chitGroupId: 'CHIT001',
          chitGroupName: 'Monthly Chit Group',
          amount: 50000,
          purpose: 'Home Renovation',
          duration: 12,
          monthlyIncome: 75000,
          employmentType: 'Salaried',
          status: 'approved',
          appliedDate: '2024-03-15',
          approvedDate: '2024-03-20',
          documents: [
            {
              id: 'DOC001',
              name: 'Salary Slip',
              type: 'application/pdf',
              uploadedAt: '2024-03-15',
              status: 'verified',
            },
            {
              id: 'DOC002',
              name: 'Bank Statement',
              type: 'application/pdf',
              uploadedAt: '2024-03-15',
              status: 'verified',
            },
          ],
          repayments: [
            {
              id: 'REP001',
              dueDate: '2024-04-15',
              amount: 5000,
              status: 'pending',
            },
            {
              id: 'REP002',
              dueDate: '2024-05-15',
              amount: 5000,
              status: 'pending',
            },
          ],
        };
        
        setLoan(mockData);
      } catch (error) {
        console.error('Failed to fetch loan details:', error);
        toast.error('Failed to load loan details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  const getStatusColor = (status: LoanDetails['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'disbursed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRepaymentStatusColor = (status: LoanDetails['repayments'][0]['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getDocumentStatusColor = (status: LoanDetails['documents'][0]['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loan not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Loan Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Loan ID: {loan.id}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(loan.status)}`}>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Loan Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chit Group</p>
                <p className="text-gray-900 dark:text-white font-medium">{loan.chitGroupName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  ₹{loan.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
                <p className="text-gray-900 dark:text-white font-medium">{loan.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-gray-900 dark:text-white font-medium">{loan.duration} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  ₹{loan.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employment Type</p>
                <p className="text-gray-900 dark:text-white font-medium">{loan.employmentType}</p>
              </div>
            </div>
          </div>

          {/* Repayment Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Repayment Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Paid Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loan.repayments.map((repayment) => (
                    <tr key={repayment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(repayment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{repayment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRepaymentStatusColor(repayment.status)}`}>
                          {repayment.status.charAt(0).toUpperCase() + repayment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {repayment.paidDate ? new Date(repayment.paidDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Timeline and Documents */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Application Submitted
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(loan.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {loan.approvedDate && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Loan Approved
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(loan.approvedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {loan.disbursedDate && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Loan Disbursed
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(loan.disbursedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {loan.closedDate && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Loan Closed
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(loan.closedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Documents
            </h2>
            <div className="space-y-4">
              {loan.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDocumentStatusColor(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails; 