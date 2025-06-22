import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLoanApprovalStore } from '@/store/loanApprovalStore';
import { useDocumentStore } from '@/store/documentStore';
import { useRiskStore } from '@/store/riskStore';
import { useNotificationStore } from '@/store/notificationStore';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationCircleIcon, ArrowPathIcon, BellIcon, ChatBubbleLeftIcon, DocumentCheckIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import ChatSupport from '@/components/chat/ChatSupport';
import { useAuthStore } from '@/store/authStore';


interface LoanApplicationStatusProps {
  loanId: string;
  userId: string;
}

const LoanApplicationStatus = ({ loanId, userId }: LoanApplicationStatusProps) => {
  const { approvals, fetchApprovals } = useLoanApprovalStore();
  const { documents, fetchUserDocuments } = useDocumentStore();
  const { currentAssessment, fetchRiskScore } = useRiskStore();
  const { createNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>('2-3 business days');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchApprovals(loanId),
          fetchUserDocuments(userId),
          fetchRiskScore(userId),
        ]);
      } catch (error) {
        console.error('Failed to load loan application status:', error);
        setError('Failed to load loan application status');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loanId, userId, fetchApprovals, fetchUserDocuments, fetchRiskScore]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'PENDING':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <ExclamationCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchApprovals(loanId),
        fetchUserDocuments(userId),
        fetchRiskScore(userId),
      ]);
    } catch (error) {
      console.error('Failed to refresh status:', error);
      setError('Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      createNotification({
        userId,
        type: 'info',
        title: 'Status Notifications Enabled',
        message: 'You will now receive updates about your loan application status.',
      });
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
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatSupport
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userId={userId}
        userRole={user?.role || ''}
        userName={user?.name || ''}
      />
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Status</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={toggleNotifications}
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                notificationsEnabled
                  ? 'border-primary-300 text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <BellIcon className="h-4 w-4 mr-2" />
              {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
              Support
            </button>
          </div>
        </div>
        {/* Current Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <DocumentCheckIcon className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {documents.filter(d => d.status === 'VERIFIED').length} of {documents.length} verified
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Assessment</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Score: {currentAssessment?.score || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Approvals</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {approvals.filter(a => a.status === 'APPROVED').length} of {approvals.length} approved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Approval Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Approval Timeline</h3>
          <div className="space-y-4">
            {approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(approval.status)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {approval.level} Approval
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(approval.status)}`}>
                      {approval.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {approval.approverName} ({approval.approverRole})
                  </p>
                  {approval.comments && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      "{approval.comments}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(approval.updatedAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanApplicationStatus; 