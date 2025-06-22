import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  HardDrive,
  AlertOctagon,
  Check,
  Lock,
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  source: string;
}

const SystemHealth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  useEffect(() => {
    // Simulate loading system health data
    const loadSystemHealth = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: SystemMetric[] = [
          {
            id: '1',
            name: 'CPU Usage',
            value: 45,
            unit: '%',
            status: 'healthy',
            trend: 'stable',
          },
          {
            id: '2',
            name: 'Memory Usage',
            value: 68,
            unit: '%',
            status: 'warning',
            trend: 'up',
          },
          {
            id: '3',
            name: 'Database Connections',
            value: 120,
            unit: 'connections',
            status: 'healthy',
            trend: 'stable',
          },
          {
            id: '4',
            name: 'Active Users',
            value: 450,
            unit: 'users',
            status: 'healthy',
            trend: 'up',
          },
        ];

        const mockAlerts: SystemAlert[] = [
          {
            id: '1',
            type: 'warning',
            message: 'High memory usage detected',
            timestamp: new Date().toISOString(),
            source: 'System Monitor',
          },
          {
            id: '2',
            type: 'info',
            message: 'Database backup completed successfully',
            timestamp: new Date().toISOString(),
            source: 'Backup Service',
          },
        ];

        setMetrics(mockMetrics);
        setAlerts(mockAlerts);
      } finally {
        setIsLoading(false);
      }
    };

    loadSystemHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor system performance and health metrics
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
                {metric.name.includes('CPU') ? (
                  <HardDrive className="h-6 w-6" />
                ) : metric.name.includes('Memory') ? (
                  <HardDrive className="h-6 w-6" />
                ) : metric.name.includes('Database') ? (
                  <HardDrive className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}{metric.unit}
                  </p>
                  <span className={`ml-2 ${getStatusColor(metric.status)}`}>
                    {metric.status === 'healthy' ? (
                      <Check className="h-5 w-5" />
                    ) : metric.status === 'warning' ? (
                      <AlertOctagon className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Alerts</h2>
        </div>
        <div className="p-6">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {alert.type === 'error' ? (
                        <AlertOctagon className="h-5 w-5" />
                      ) : alert.type === 'warning' ? (
                        <AlertOctagon className="h-5 w-5" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="mt-1 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {alert.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                All Systems Operational
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No active alerts at this time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth; 