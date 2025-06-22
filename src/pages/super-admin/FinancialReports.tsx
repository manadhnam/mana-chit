import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  type: 'table' | 'chart';
  data: any;
}

const FinancialReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  const metrics: FinancialMetric[] = [
    {
      id: 'total_revenue',
      label: 'Total Revenue',
      value: 1250000,
      change: 12.5,
      trend: 'up',
      icon: BanknotesIcon
    },
    {
      id: 'total_loans',
      label: 'Total Loans',
      value: 850000,
      change: 8.2,
      trend: 'up',
      icon: ChartBarIcon
    },
    {
      id: 'recovery_rate',
      label: 'Recovery Rate',
      value: 94.5,
      change: 2.1,
      trend: 'up',
      icon: ArrowTrendingUpIcon
    },
    {
      id: 'default_rate',
      label: 'Default Rate',
      value: 5.5,
      change: 1.2,
      trend: 'down',
      icon: ArrowTrendingDownIcon
    }
  ];

  const reportSections: ReportSection[] = [
    {
      id: 'revenue_breakdown',
      title: 'Revenue Breakdown',
      description: 'Detailed breakdown of revenue by category',
      type: 'chart',
      data: {
        labels: ['Loan Interest', 'Processing Fees', 'Late Fees', 'Other'],
        values: [65, 20, 10, 5]
      }
    },
    {
      id: 'loan_distribution',
      title: 'Loan Distribution',
      description: 'Distribution of loans by amount range',
      type: 'chart',
      data: {
        labels: ['0-10k', '10k-50k', '50k-1L', '1L-5L', '5L+'],
        values: [30, 25, 20, 15, 10]
      }
    }
  ];

  const handleDownloadReport = async (type: string) => {
    try {
      setLoading(true);
      // TODO: Implement report download logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success(`${type} report downloaded successfully`);
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Financial Reports
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comprehensive financial overview and reports
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                onClick={() => handleDownloadReport('comprehensive')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon
                    className={`h-6 w-6 ${
                      metric.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {metric.label}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {metric.id.includes('rate')
                          ? `${metric.value}%`
                          : new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0
                            }).format(metric.value)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div
                  className={`flex items-center text-sm ${
                    metric.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{metric.change}% from last period</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {reportSections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
              <div className="mt-6">
                {/* TODO: Implement chart visualization */}
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Chart visualization will be implemented here
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Reports */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Additional Reports
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Loan Performance Report',
              'Revenue Analysis',
              'Default Analysis',
              'Agent Performance',
              'Branch Performance',
              'Customer Demographics'
            ].map((report) => (
              <button
                key={report}
                onClick={() => handleDownloadReport(report.toLowerCase().replace(/\s+/g, '_'))}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                {report}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialReports; 