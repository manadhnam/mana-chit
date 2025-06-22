import { useState, useEffect } from 'react';
import { DocumentTextIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Report {
  id: string;
  title: string;
  type: 'financial' | 'operational' | 'performance' | 'compliance';
  period: string;
  status: 'draft' | 'final' | 'archived';
  created_at: string;
  updated_at: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  useEffect(() => {
    fetchReports();
  }, [selectedType, selectedPeriod]);

  const fetchReports = async () => {
    try {
      // TODO: Replace with actual API calls
      // Mock data for now
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Monthly Financial Report',
          type: 'financial',
          period: '2024-03',
          status: 'final',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        {
          id: '2',
          title: 'Operational Efficiency Report',
          type: 'operational',
          period: '2024-03',
          status: 'final',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        {
          id: '3',
          title: 'Staff Performance Review',
          type: 'performance',
          period: '2024-03',
          status: 'draft',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        {
          id: '4',
          title: 'Compliance Audit Report',
          type: 'compliance',
          period: '2024-03',
          status: 'final',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      ];
      setReports(mockReports);
    } catch (error) {
      toast.error('Failed to load reports');
    }
  };

  const filteredReports = reports.filter((report) => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedPeriod !== 'all' && report.period !== selectedPeriod) return false;
    return true;
  });

  const reportTypeData = {
    labels: ['Financial', 'Operational', 'Performance', 'Compliance'],
    datasets: [
      {
        label: 'Reports by Type',
        data: [
          reports.filter((r) => r.type === 'financial').length,
          reports.filter((r) => r.type === 'operational').length,
          reports.filter((r) => r.type === 'performance').length,
          reports.filter((r) => r.type === 'compliance').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  const reportStatusData = {
    labels: ['Draft', 'Final', 'Archived'],
    datasets: [
      {
        label: 'Reports by Status',
        data: [
          reports.filter((r) => r.status === 'draft').length,
          reports.filter((r) => r.status === 'final').length,
          reports.filter((r) => r.status === 'archived').length,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage department reports
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Types</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="performance">Performance</option>
            <option value="compliance">Compliance</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Periods</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-01">January 2024</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reports by Type
          </h3>
          <Bar data={reportTypeData} />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reports by Status
          </h3>
          <Bar data={reportStatusData} />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white capitalize">
                      {report.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'final'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">Download</button>
                    <button className="text-gray-600 hover:text-gray-900">Duplicate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports; 