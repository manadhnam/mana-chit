import {UserGroupIcon, ClockIcon, CalendarIcon} from '@heroicons/react/24/outline';
import { ChartBarIcon, BanknotesIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';



interface PerformanceMetric {
  category: string;
  current: number;
  target: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'completed';
  unit: string;
}

const mockMetrics: PerformanceMetric[] = [
  {
    category: 'Customer Acquisition',
    current: 25,
    target: 30,
    previous: 20,
    trend: 'up',
    unit: 'customers',
  },
  {
    category: 'Transaction Volume',
    current: 150,
    target: 200,
    previous: 120,
    trend: 'up',
    unit: 'transactions',
  },
  {
    category: 'Revenue',
    current: 300000,
    target: 400000,
    previous: 250000,
    trend: 'up',
    unit: '₹',
  },
  {
    category: 'Customer Satisfaction',
    current: 4.5,
    target: 4.8,
    previous: 4.3,
    trend: 'up',
    unit: '/5',
  },
  {
    category: 'Attendance',
    current: 95,
    target: 98,
    previous: 92,
    trend: 'up',
    unit: '%',
  },
];

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Increase Customer Base',
    description: 'Acquire 30 new customers by the end of the quarter',
    target: 30,
    current: 25,
    deadline: '2024-03-31',
    status: 'on_track',
    unit: '',
  },
  {
    id: '2',
    title: 'Improve Customer Satisfaction',
    description: 'Achieve a customer satisfaction rating of 4.8',
    target: 4.8,
    current: 4.5,
    deadline: '2024-03-31',
    status: 'at_risk',
    unit: '',
  },
  {
    id: '3',
    title: 'Revenue Target',
    description: 'Generate ₹400,000 in revenue this month',
    target: 400000,
    current: 300000,
    deadline: '2024-03-31',
    status: 'at_risk',
    unit: '₹',
  },
];

const AgentPerformanceMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-600 bg-green-100';
      case 'at_risk':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Metrics</h1>
        <p className="text-gray-600">Track your performance and goals</p>
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="customers">Customers</option>
            <option value="transactions">Transactions</option>
            <option value="revenue">Revenue</option>
            <option value="satisfaction">Satisfaction</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockMetrics.map((metric) => (
          <div key={metric.category} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{metric.category}</h3>
              {metric.trend === 'up' ? (
                <ChartBarIcon className="h-5 w-5 mr-2" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-semibold ${getProgressColor(metric.current, metric.target)}`}>
                    {metric.unit === '₹' ? formatCurrency(metric.current) : metric.current}
                    {metric.unit !== '₹' && metric.unit}
                  </span>
                  <span className="text-gray-600">
                    {metric.unit === '₹' ? formatCurrency(metric.target) : metric.target}
                    {metric.unit !== '₹' && metric.unit}
                  </span>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      metric.current >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Previous: {metric.unit === '₹' ? formatCurrency(metric.previous) : metric.previous}
                {metric.unit !== '₹' && metric.unit}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Goals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockGoals.map((goal) => (
            <div key={goal.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {goal.unit === '₹' ? formatCurrency(goal.current) : goal.current} /{' '}
                      {goal.unit === '₹' ? formatCurrency(goal.target) : goal.target}
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          goal.current >= goal.target ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPerformanceMetrics; 