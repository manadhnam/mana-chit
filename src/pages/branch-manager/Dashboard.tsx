import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  HomeIcon, 
  BanknotesIcon, 
  ExclamationCircleIcon, 
  UserPlusIcon, 
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useAuthStore } from '@/store/authStore';
import { BranchQrUpload } from '@/components/chit/BranchQrUpload';
import { BranchStats } from '@/components/chit/BranchStats';
import { ChitGroupForm } from '@/components/chit/ChitGroupForm';
import { CustomerForm } from '@/components/chit/CustomerForm';
import { ManualPaymentForm } from '@/components/chit/ManualPaymentForm';
import { PaymentForm } from '@/components/chit/PaymentForm';
import { AccountList } from '@/components/chit/AccountList';
import { TransactionList } from '@/components/chit/TransactionList';
import { CustomerDetails } from '@/components/chit/CustomerDetails';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface BranchDashboardMetrics {
  totalCustomers: number;
  activeGroups: number;
  totalCollections: number;
  pendingCollections: number;
}

interface UpcomingPayment {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    type: 'loan' | 'chit';
}

const BranchDashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<BranchDashboardMetrics | null>(null);
  const [lineChartData, setLineChartData] = useState<any>({ labels: [], datasets: [] });
  const [doughnutChartData, setDoughnutChartData] = useState<any>({ labels: [], datasets: [] });
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [modalType, setModalType] = useState<null | 'customer' | 'group' | 'staff' | 'collection'>(null);
  const [modalData, setModalData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!user?.branch_id) {
        toast.error("Branch information not found. Please log in again.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const branchId = user.branch_id;

        // Fetch all data in parallel
        const [
          { count: totalCustomers },
          { count: activeGroups },
          { data: collectionsData, error: collectionsError },
          { data: pendingReceiptsData, error: pendingReceiptsError }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('branch_id', branchId).eq('role', 'customer'),
          supabase.from('chit_groups').select('*', { count: 'exact', head: true }).eq('branch_id', branchId).eq('status', 'active'),
          supabase.from('receipts').select('amount, status, created_at, loan_id, chit_group_id').eq('branch_id', branchId),
          supabase.from('receipts').select('id, amount, payment_date, customer_id, loan_id').eq('branch_id', branchId).eq('status', 'pending').order('payment_date', { ascending: true }).limit(5)
        ]);
        
        if (collectionsError) throw collectionsError;
        if (pendingReceiptsError) throw pendingReceiptsError;

        // Process Summary Metrics
        const totalCollections = collectionsData?.reduce((sum, item) => item.status === 'approved' ? sum + item.amount : sum, 0) || 0;
        const pendingCollections = collectionsData?.reduce((sum, item) => item.status === 'pending' ? sum + item.amount : sum, 0) || 0;
        
        setMetrics({
          totalCustomers: totalCustomers ?? 0,
          activeGroups: activeGroups ?? 0,
          totalCollections,
          pendingCollections,
        });
        
        // Process Line Chart Data (Monthly Collections)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTotals = (collectionsData || [])
            .filter(r => r.status === 'approved' && new Date(r.created_at) > sixMonthsAgo)
            .reduce((acc, receipt) => {
                const month = new Date(receipt.created_at).toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + receipt.amount;
                return acc;
            }, {} as Record<string, number>);

        const chartLabels = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return d.toLocaleString('default', { month: 'short' });
        }).reverse();
        
        const chartData = chartLabels.map(label => monthlyTotals[label] || 0);
        setLineChartData({
            labels: chartLabels,
            datasets: [{
                label: 'Monthly Collection',
                data: chartData,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.3,
            }],
        });
        
        // Process Doughnut Chart Data (Collection Types)
        const loanCollections = collectionsData?.filter(r => r.loan_id).reduce((sum, r) => sum + r.amount, 0) || 0;
        const chitCollections = collectionsData?.filter(r => r.chit_group_id).reduce((sum, r) => sum + r.amount, 0) || 0;
        setDoughnutChartData({
            labels: ['Loan Collections', 'Chit Collections'],
            datasets: [{
                data: [loanCollections, chitCollections],
                backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(20, 184, 166, 0.8)'],
                borderColor: ['rgba(59, 130, 246, 1)', 'rgba(20, 184, 166, 1)'],
                borderWidth: 1,
            }],
        });

        // Process Upcoming Payments
        if (pendingReceiptsData && pendingReceiptsData.length > 0) {
            const customerIds = [...new Set(pendingReceiptsData.map(p => p.customer_id))];
            const { data: customersData, error: customersError } = await supabase.from('users').select('id, name').in('id', customerIds);
            if (customersError) throw customersError;

            const customerMap = new Map(customersData.map(c => [c.id, c.name]));
            const formattedUpcomingPayments = pendingReceiptsData.map((p) => ({
                id: p.id,
                name: customerMap.get(p.customer_id) || 'Unknown Customer',
                amount: p.amount,
                dueDate: new Date(p.payment_date).toLocaleDateString(),
                type: (p.loan_id ? 'loan' : 'chit') as 'loan' | 'chit',
            }));
            setUpcomingPayments(formattedUpcomingPayments);
        } else {
            setUpcomingPayments([]);
        }

      } catch (error: any) {
        toast.error("Failed to fetch dashboard data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranchData();
  }, [user]);

  const openModal = (type: 'customer' | 'group' | 'staff' | 'collection', data: any) => {
    setModalType(type);
    setModalData(data);
  };
  const closeModal = () => {
    setModalType(null);
    setModalData(null);
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
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Branch overview and management
        </p>
      </div>

      {/* Audit Log Link */}
      <div className="flex justify-end mb-2">
        <a href="/branch-manager/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics?.totalCustomers ?? '...'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Groups</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics?.activeGroups ?? '...'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collections</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics ? formatCurrency(metrics.totalCollections) : '...'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Collections</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics ? formatCurrency(metrics.pendingCollections) : '...'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/customers')}>
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Customer
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/groups')}>
              <HomeIcon className="h-5 w-5 mr-2" />
              Add Group
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/StaffManagement')}>
              <UserIcon className="h-5 w-5 mr-2" />
              Staff Directory
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/Notifications')}>
              <BellIcon className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/performance-metrics')}>
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Performance Metrics
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => navigate('/branch-manager/BranchReports')}>
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Financial Reports
            </button>
          </div>
        </motion.div>
      </div>

      {/* Customer-Group Mapping Drill-Down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer-Group Mapping</h2>
          <div className="flex space-x-2">
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700">
              <option>All Groups</option>
              <option>Gold Group</option>
              <option>Silver Group</option>
              <option>Platinum Group</option>
            </select>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Mock data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Alice</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Gold, Silver</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Gold</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gold</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">₹5,000</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">of ₹5,000</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  2024-06-01
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('customer', { name: 'Alice', groups: ['Gold', 'Silver'], payments: [{ date: '2024-06-01', amount: 5000, status: 'Paid' }] })}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Collect
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Bob</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Gold</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Gold</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gold</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">₹3,000</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">of ₹3,000</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  2024-06-02
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('customer', { name: 'Bob', groups: ['Gold'], payments: [{ date: '2024-06-02', amount: 3000, status: 'Paid' }] })}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Collect
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Collection Trends</h2>
          <div className="h-64">
             <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Collection Composition</h2>
          <div className="h-64 flex items-center justify-center">
             <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }}/>
          </div>
        </div>
      </div>

      {/* Quick Actions & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2">
           <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Payments</h2>
            {upcomingPayments.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {upcomingPayments.map((payment) => (
                    <li key={payment.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`mr-4 rounded-full h-8 w-8 flex items-center justify-center ${payment.type === 'loan' ? 'bg-blue-100' : 'bg-green-100'}`}>
                           <BanknotesIcon className={`h-5 w-5 ${payment.type === 'loan' ? 'text-blue-600' : 'text-green-600'}`} />
                        </div>
                        <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Due: {payment.dueDate}</p>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No upcoming payments.</p>
                </div>
            )}
            </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Collection Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collection Trends</h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                <Line 
                  data={lineChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Upcoming Payments */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-warning-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Payments</h2>
            </div>
            <div className="p-6">
              {upcomingPayments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center"
                    >
                      <div className={`flex-shrink-0 p-3 rounded-full mr-4 ${
                        payment.type === 'loan'
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400'
                      }`}>
                        <BanknotesIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {payment.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {new Date(payment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Link
                          to={`/branch-manager/payments/${payment.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Collect
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No upcoming payments due.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Customer Distribution */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Distribution</h2>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={doughnutChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        },
                      },
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/branch-manager/loans/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  New Loan
                </Link>
                <Link
                  to="/branch-manager/chit-groups/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700"
                >
                  New Chit Group
                </Link>
                <Link
                  to="/branch-manager/customers/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700"
                >
                  New Customer
                </Link>
                <Link
                  to="/branch-manager/payments/collect"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Collect Payment
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Management</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add New Staff
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <UserIcon className="h-5 w-5 mr-2" />
              Staff Directory
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <BellIcon className="h-5 w-5 mr-2" />
              Staff Notifications
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports & Analytics</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Performance Metrics
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Financial Reports
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              Staff Analytics
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branch Settings</h2>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Branch Status: Active</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">All systems operational</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Last Update: 2 hours ago</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Next review: 22 hours</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Active Staff: 15</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">Peak: 18 staff</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chit Fund Management */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Branch QR Upload</h2>
          <BranchQrUpload branchId="branch-1" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Branch Stats</h2>
          <BranchStats stats={{ totalCustomers: 20, activeLoans: 2, totalCollections: 250000, onTimePayers: 18, defaulters: 1, availableFund: 50000 }} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Chit Group Form</h2>
          <ChitGroupForm branchId="branch-1" onSuccess={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Customer Form</h2>
          <CustomerForm branchId="branch-1" onSuccess={() => {}} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Manual Payment Form</h2>
          <ManualPaymentForm agentId="agent-1" groupId="group-1" onSubmit={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment Form</h2>
          <PaymentForm branchId="branch-1" onSuccess={() => {}} />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Accounts</h2>
          <AccountList accounts={[]} isLoading={false} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <TransactionList transactions={[]} isLoading={false} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <CustomerDetails customer={{ id: 'cust-1', name: 'Sample Customer', email: 'sample@email.com', phone: '1234567890', address: '123 Main St', village_id: 1, aadhar_number: '1234-5678-9012', pan_number: 'ABCDE1234F', date_of_birth: '1990-01-01', gender: 'male', occupation: 'Engineer', monthly_income: 50000, status: 'active', documents: [] }} isLoading={false} />
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            {modalType === 'customer' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Customer Details: {modalData.name}</h2>
                <div className="mb-2">Groups: {modalData.groups.join(', ')}</div>
                <div className="mb-2">Payment History:</div>
                <ul className="list-disc pl-6">
                  {modalData.payments.map((p: any, i: number) => (
                    <li key={i}>{p.date}: ₹{p.amount} - {p.status}</li>
                  ))}
                </ul>
              </div>
            )}
            {modalType === 'group' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Group Details: {modalData.name}</h2>
                <div className="mb-2">Members: {modalData.members.join(', ')}</div>
                <div className="mb-2">Collection Status: {modalData.collectionStatus}</div>
              </div>
            )}
            {modalType === 'staff' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Staff Details: {modalData.name}</h2>
                <div className="mb-2">Role: {modalData.role}</div>
                <div className="mb-2">Assigned Groups: {modalData.groups.join(', ')}</div>
                <div className="mb-2">Collection Performance: {modalData.performance}</div>
              </div>
            )}
            {modalType === 'collection' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Collection Details</h2>
                <div className="mb-2">Customer: {modalData.customer}</div>
                <div className="mb-2">Amount: ₹{modalData.amount}</div>
                <div className="mb-2">Type: {modalData.type}</div>
                <div className="mb-2">Date: {modalData.date}</div>
                <div className="mb-2">Status: {modalData.status}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDashboard; 