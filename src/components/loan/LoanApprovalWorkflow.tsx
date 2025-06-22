import { useEffect, useState } from 'react';
import { useLoanApprovalStore } from '@/store/loanApprovalStore';
import { useRiskStore } from '@/store/riskStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuditStore } from '@/store/auditStore';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';


interface LoanApprovalWorkflowProps {
  loanId: string;
  userId: string;
  onApprovalComplete: () => void;
}

const LoanApprovalWorkflow = ({ loanId, userId, onApprovalComplete }: LoanApprovalWorkflowProps) => {
  const { approvals, currentApproval, fetchApprovals, approveLoan, rejectLoan, isLoading, error } = useLoanApprovalStore();
  const { currentAssessment, fetchRiskScore } = useRiskStore();
  const { createNotification } = useNotificationStore();
  const { logAction } = useAuditStore();
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchApprovals(loanId);
    fetchRiskScore(userId);
  }, [loanId, userId, fetchApprovals, fetchRiskScore]);

  const handleApprove = async () => {
    if (!currentApproval) return;
    
    try {
      await approveLoan(currentApproval.id, comments);
      await createNotification({
        userId,
        type: 'IN_APP',
        title: 'Loan Approved',
        message: `Your loan has been approved at ${currentApproval.level} level.`,
      });
      await logAction({
        userId,
        userRole: 'APPROVER',
        action: 'APPROVE_LOAN',
        module: 'LOAN',
        details: { loanId, approvalId: currentApproval.id, level: currentApproval.level },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });
      onApprovalComplete();
    } catch (error) {
      console.error('Failed to approve loan:', error);
    }
  };

  const handleReject = async () => {
    if (!currentApproval) return;
    
    try {
      await rejectLoan(currentApproval.id, comments);
      await createNotification({
        userId,
        type: 'IN_APP',
        title: 'Loan Rejected',
        message: `Your loan has been rejected at ${currentApproval.level} level.`,
      });
      await logAction({
        userId,
        userRole: 'APPROVER',
        action: 'REJECT_LOAN',
        module: 'LOAN',
        details: { loanId, approvalId: currentApproval.id, level: currentApproval.level },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });
      onApprovalComplete();
    } catch (error) {
      console.error('Failed to reject loan:', error);
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
      {/* Approval Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Approval Progress</h3>
        <div className="space-y-4">
          {['BRANCH', 'REGIONAL', 'HEAD'].map((level) => {
            const approval = approvals.find(a => a.level === level);
            return (
              <div key={level} className="flex items-center">
                <div className="flex-shrink-0">
                  {approval?.status === 'APPROVED' ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : approval?.status === 'REJECTED' ? (
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{level} Level</p>
                  {approval && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {approval.status} by {approval.approverName} ({approval.approverRole})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment */}
      {currentAssessment && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Risk Score</span>
              <span className={`text-sm font-medium ${
                currentAssessment.category === 'LOW' ? 'text-green-600' :
                currentAssessment.category === 'MEDIUM' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentAssessment.score} ({currentAssessment.category})
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h4>
              <ul className="space-y-2">
                {currentAssessment.factors.map((factor) => (
                  <li key={factor.id} className="text-sm text-gray-500 dark:text-gray-400">
                    {factor.name}: {factor.value} ({factor.weight} weight)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {currentAssessment.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-500 dark:text-gray-400">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Approval Actions */}
      {currentApproval && currentApproval.status === 'PENDING' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Approval Actions</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments
              </label>
              <textarea
                id="comments"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprove}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReject}
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

export default LoanApprovalWorkflow; 