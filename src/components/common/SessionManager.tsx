import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ClockIcon, 
  ExclamationTriangleIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  getSessionInfo, 
  isSessionActive, 
  extendSession, 
  logout,
  getAuditLogs 
} from '@/utils/sessionManager';

interface SessionManagerProps {
  onLogout?: () => void;
  showAuditLogs?: boolean;
}

const SessionManager: React.FC<SessionManagerProps> = ({ 
  onLogout, 
  showAuditLogs = false 
}) => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const updateSessionInfo = () => {
      const info = getSessionInfo();
      setSessionInfo(info);
      
      // Show warning if session is about to expire
      if (info.isWarningActive && !showWarning) {
        setShowWarning(true);
      }
    };

    // Update session info every minute
    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 60000);

    return () => clearInterval(interval);
  }, [showWarning]);

  const handleExtendSession = () => {
    extendSession();
    setShowWarning(false);
  };

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const handleViewAuditLogs = () => {
    const logs = getAuditLogs();
    setAuditLogs(logs);
    setShowAuditModal(true);
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!sessionInfo || !sessionInfo.isActive) {
    return null;
  }

  return (
    <>
      {/* Session Status Bar */}
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 max-w-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Session Active
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {sessionInfo.user && (
                <div className="flex items-center space-x-1">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sessionInfo.user.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Time Remaining */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Time Remaining:
              </span>
              <span className={`text-sm font-mono ${
                sessionInfo.timeRemaining < 300000 ? 'text-red-600' : 'text-gray-900 dark:text-white'
              }`}>
                {formatTimeRemaining(sessionInfo.timeRemaining)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  sessionInfo.timeRemaining < 300000 
                    ? 'bg-red-500' 
                    : sessionInfo.timeRemaining < 600000 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, (sessionInfo.timeRemaining / (30 * 60 * 1000)) * 100))}%`
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleExtendSession}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Extend Session
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Audit Logs Button */}
            {showAuditLogs && (
              <button
                onClick={handleViewAuditLogs}
                className="w-full px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                View Audit Logs
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Session Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Session Expiring Soon
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your session will expire in {formatTimeRemaining(sessionInfo.timeRemaining)}. 
                Please save your work and extend your session to continue.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Extend Session
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audit Logs Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-4 max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Audit Logs
                </h3>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  {auditLogs.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No audit logs available
                    </p>
                  ) : (
                    auditLogs.map((log, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {log.details}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          User: {log.userEmail} | Session: {log.sessionId}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SessionManager; 