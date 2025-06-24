import {UserGroupIcon, ClockIcon, CalendarIcon, BanknotesIcon, ChartBarIcon, ArrowTrendingDownIcon, TrophyIcon, StarIcon} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

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

interface Commission {
  id: string;
  amount: number;
  type: 'referral' | 'collection' | 'performance' | 'bonus';
  date: string;
  status: 'pending' | 'paid';
  description: string;
}

interface AgentMetricsData {
  customer_acquisition: number;
  transaction_volume: number;
  revenue: number;
  customer_satisfaction: number;
  attendance: number;
  targets: {
    customer_acquisition: number;
    transaction_volume: number;
    revenue: number;
    customer_satisfaction: number;
    attendance: number;
  };
  previous: {
    customer_acquisition: number;
    transaction_volume: number;
    revenue: number;
    customer_satisfaction: number;
    attendance: number;
  };
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

const mockCommissions: Commission[] = [
  {
    id: '1',
    amount: 10000,
    type: 'referral',
    date: '2024-03-15',
    status: 'paid',
    description: 'Referral commission',
  },
  {
    id: '2',
    amount: 15000,
    type: 'collection',
    date: '2024-03-20',
    status: 'paid',
    description: 'Collection commission',
  },
  {
    id: '3',
    amount: 20000,
    type: 'performance',
    date: '2024-03-25',
    status: 'paid',
    description: 'Performance commission',
  },
  {
    id: '4',
    amount: 5000,
    type: 'bonus',
    date: '2024-03-30',
    status: 'paid',
    description: 'Performance bonus',
  },
];

const transformMetrics = (data: AgentMetricsData): PerformanceMetric[] => {
  if (!data) return mockMetrics;

  return [
    {
      category: 'Customer Acquisition',
      current: data.customer_acquisition,
      target: data.targets.customer_acquisition,
      previous: data.previous.customer_acquisition,
      trend: data.customer_acquisition > data.previous.customer_acquisition ? 'up' : 'down',
      unit: 'customers',
    },
    {
      category: 'Transaction Volume',
      current: data.transaction_volume,
      target: data.targets.transaction_volume,
      previous: data.previous.transaction_volume,
      trend: data.transaction_volume > data.previous.transaction_volume ? 'up' : 'down',
      unit: 'transactions',
    },
    {
      category: 'Revenue',
      current: data.revenue,
      target: data.targets.revenue,
      previous: data.previous.revenue,
      trend: data.revenue > data.previous.revenue ? 'up' : 'down',
      unit: '₹',
    },
    {
      category: 'Customer Satisfaction',
      current: data.customer_satisfaction,
      target: data.targets.customer_satisfaction,
      previous: data.previous.customer_satisfaction,
      trend: data.customer_satisfaction > data.previous.customer_satisfaction ? 'up' : 'down',
      unit: '/5',
    },
    {
      category: 'Attendance',
      current: data.attendance,
      target: data.targets.attendance,
      previous: data.previous.attendance,
      trend: data.attendance > data.previous.attendance ? 'up' : 'down',
      unit: '%',
    },
  ];
};

const AgentPerformanceMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Fetch real metrics from Supabase
        const { data: metricsData, error: metricsError } = await supabase
          .from('agent_metrics')
          .select('*')
          .eq('agent_id', user.id)
          .single();

        if (metricsError) throw metricsError;

        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('agent_goals')
          .select('*')
          .eq('agent_id', user.id);

        if (goalsError) throw goalsError;

        // Fetch commissions
        const { data: commissionsData, error: commissionsError } = await supabase
          .from('agent_commissions')
          .select('*')
          .eq('agent_id', user.id)
          .order('date', { ascending: false });

        if (commissionsError) throw commissionsError;

        // Transform and set data
        setMetrics(transformMetrics(metricsData));
        setGoals(goalsData);
        setCommissions(commissionsData);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        // Use mock data as fallback
        setMetrics(mockMetrics);
        setGoals(mockGoals);
        setCommissions(mockCommissions);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const subscription: RealtimeChannel = supabase
      .channel('agent_metrics')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'agent_metrics',
          filter: `agent_id=eq.${user?.id}`,
        },
        (payload: { new: AgentMetricsData }) => {
          console.log('Real-time update:', payload);
          setMetrics(current => transformMetrics(payload.new));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, timeRange]);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance & Earnings</h1>
        <p className="text-gray-600">Track your performance, goals, and commissions</p>
      </div>

      {/* Commission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
            <BanknotesIcon className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{commissions.reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">Lifetime earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">This Month</h3>
            <TrophyIcon className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{commissions
              .filter(c => new Date(c.date).getMonth() === new Date().getMonth())
              .reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">Current month earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance Bonus</h3>
            <StarIcon className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{commissions
              .filter(c => c.type === 'bonus')
              .reduce((sum, c) => sum + (c.status === 'paid' ? c.amount : 0), 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">Total performance bonuses</p>
        </motion.div>
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
        {metrics.map((metric) => (
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
          {goals.map((goal) => (
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

      {/* New Commission History Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Commission History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissions.map((commission) => (
                <tr key={commission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(commission.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {commission.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{commission.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      commission.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {commission.description}
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

export default AgentPerformanceMetrics; 