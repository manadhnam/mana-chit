import {UserGroupIcon, ClockIcon} from '@heroicons/react/24/outline';
import { ChartBarIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';



interface AgentMetrics {
  totalCustomers: number;
  activeCustomers: number;
  totalTransactions: number;
  totalRevenue: number;
  performance: {
    rating: number;
    attendance: number;
    tasksCompleted: number;
    customerSatisfaction: number;
  };
  monthlyStats: {
    month: string;
    customers: number;
    transactions: number;
    revenue: number;
  }[];
}

const mockMetrics: AgentMetrics = {
  totalCustomers: 150,
  activeCustomers: 120,
  totalTransactions: 450,
  totalRevenue: 900000,
  performance: {
    rating: 4.5,
    attendance: 95,
    tasksCompleted: 180,
    customerSatisfaction: 4.8,
  },
  monthlyStats: [
    {
      month: 'Jan 2024',
      customers: 25,
      transactions: 75,
      revenue: 150000,
    },
    {
      month: 'Feb 2024',
      customers: 30,
      transactions: 90,
      revenue: 180000,
    },
    {
      month: 'Mar 2024',
      customers: 35,
      transactions: 105,
      revenue: 210000,
    },
  ],
};

const AgentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Analytics</h1>
        <p className="text-gray-600">Track your performance and customer metrics</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="all">All Metrics</option>
            <option value="customers">Customers</option>
            <option value="transactions">Transactions</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{mockMetrics.totalCustomers}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">Active: {mockMetrics.activeCustomers}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Performance Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{mockMetrics.performance.rating}/5</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            <span className="text-green-600">+0.2 from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ClockIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-2xl font-semibold text-gray-900">{mockMetrics.performance.attendance}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            <span className="text-green-600">+1.5% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BanknotesIcon />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(mockMetrics.totalRevenue)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>
      </div>

      {/* Monthly Stats Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Monthly Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMetrics.monthlyStats.map((stat) => (
                <tr key={stat.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{stat.month}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stat.customers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stat.transactions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(stat.revenue)}</div>
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

export default AgentAnalytics; 