import { MagnifyingGlassIcon, CalendarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';



interface FinancialReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual';
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactions: number;
  branches: {
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const mockReports: FinancialReport[] = [
  {
    id: '1',
    title: 'March 2024 Monthly Report',
    type: 'monthly',
    period: 'March 2024',
    totalRevenue: 2500000,
    totalExpenses: 1500000,
    netProfit: 1000000,
    transactions: 1250,
    branches: [
      {
        name: 'Main Branch',
        revenue: 900000,
        expenses: 540000,
        profit: 360000,
      },
      {
        name: 'North Branch',
        revenue: 760000,
        expenses: 456000,
        profit: 304000,
      },
      {
        name: 'South Branch',
        revenue: 640000,
        expenses: 384000,
        profit: 256000,
      },
      {
        name: 'East Branch',
        revenue: 200000,
        expenses: 120000,
        profit: 80000,
      },
    ],
    status: 'published',
    createdAt: '2024-03-31T23:59:59',
    updatedAt: '2024-04-01T00:00:00',
  },
  {
    id: '2',
    title: 'Q1 2024 Quarterly Report',
    type: 'quarterly',
    period: 'Q1 2024',
    totalRevenue: 7500000,
    totalExpenses: 4500000,
    netProfit: 3000000,
    transactions: 3750,
    branches: [
      {
        name: 'Main Branch',
        revenue: 2700000,
        expenses: 1620000,
        profit: 1080000,
      },
      {
        name: 'North Branch',
        revenue: 2280000,
        expenses: 1368000,
        profit: 912000,
      },
      {
        name: 'South Branch',
        revenue: 1920000,
        expenses: 1152000,
        profit: 768000,
      },
      {
        name: 'East Branch',
        revenue: 600000,
        expenses: 360000,
        profit: 240000,
      },
    ],
    status: 'published',
    createdAt: '2024-03-31T23:59:59',
    updatedAt: '2024-04-01T00:00:00',
  },
];

const MandalFinancialReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report => {
    const matchesReport = selectedReport === 'all' || report.type === selectedReport;
    const matchesPeriod = selectedPeriod === 'all' || report.period.includes(selectedPeriod);
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesReport && matchesPeriod && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">View and analyze financial reports for your mandal</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all">All Periods</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
                  <p className="text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(report.totalRevenue)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(report.totalExpenses)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(report.netProfit)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-xl font-semibold text-gray-900">{report.transactions}</p>
                </div>
              </div>

              {/* Branch Performance */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.branches.map((branch) => (
                      <tr key={branch.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {branch.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(branch.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(branch.expenses)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(branch.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MandalFinancialReports; 