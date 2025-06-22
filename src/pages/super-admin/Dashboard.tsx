import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BellIcon,
  UserIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BuildingOffice2Icon,
  CurrencyRupeeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/formatters';
import { AdminAnalyticsDashboard } from '@/components/chit/AdminAnalyticsDashboard';
import ChitGroupConfig from '@/components/chit/ChitGroupConfig';
import { BranchStats } from '@/components/chit/BranchStats';
import { User, ChitGroup, Receipt } from '@/types/database';

interface DashboardStats {
  customerCount: number;
  groupCount: number;
  staffCount: number;
  totalCollections: number;
  branchCount: number;
}

interface RecentCustomer extends User {
    branch_name: string;
}

interface RecentReceipt extends Receipt {
    customer_name: string;
    branch_name: string;
}

const SuperAdminDashboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
  const [recentGroups, setRecentGroups] = useState<ChitGroup[]>([]);
  const [recentStaff, setRecentStaff] = useState<User[]>([]);
  const [recentCollections, setRecentCollections] = useState<RecentReceipt[]>([]);
  const [modalType, setModalType] = useState<null | 'branch' | 'customer' | 'group' | 'staff' | 'collection'>(null);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Parallel fetching
        const [
          { count: customerCount },
          { count: groupCount },
          { count: staffCount },
          { data: totalCollectionsData },
          { count: branchCount },
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
          supabase.from('chit_groups').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['agent', 'branchManager', 'mandalHead', 'departmentHead']),
          supabase.from('receipts').select('amount'),
          supabase.from('branches').select('*', { count: 'exact', head: true }),
        ]);

        const totalCollections = totalCollectionsData?.reduce((sum, item) => sum + item.amount, 0) || 0;

        setStats({
          customerCount: customerCount ?? 0,
          groupCount: groupCount ?? 0,
          staffCount: staffCount ?? 0,
          totalCollections,
          branchCount: branchCount ?? 0,
        });
        
        // Fetch recent activities
        const { data: customersData, error: customersError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'customer')
            .order('created_at', { ascending: false })
            .limit(5);
        if(customersError) throw customersError;

        if (customersData && customersData.length > 0) {
            const branchIds = [...new Set(customersData.map(c => c.branch_id).filter(id => id))];
            const { data: branchesData, error: branchesError } = await supabase
                .from('branches')
                .select('id, name')
                .in('id', branchIds);
            if(branchesError) throw branchesError;

            const branchMap = new Map(branchesData.map(b => [b.id, b.name]));

            setRecentCustomers(customersData.map((c: User) => ({
                ...c,
                branch_name: branchMap.get(c.branch_id!) || 'N/A'
            })));
        }

        const { data: groupsData, error: groupsError } = await supabase
            .from('chit_groups')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        if(groupsError) throw groupsError;
        setRecentGroups(groupsData);

        const { data: staffData, error: staffError } = await supabase
            .from('users')
            .select('*')
            .in('role', ['agent', 'branchManager'])
            .order('created_at', { ascending: false })
            .limit(5);
        if(staffError) throw staffError;
        setRecentStaff(staffData);

        const { data: collectionsData, error: collectionsError } = await supabase
            .from('receipts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if(collectionsError) throw collectionsError;

        if (collectionsData && collectionsData.length > 0) {
            const userIds = [...new Set(collectionsData.map(c => c.customer_id))];
            const branchIds = [...new Set(collectionsData.map(c => c.branch_id))];

            const { data: usersData, error: usersError } = await supabase.from('users').select('id, name').in('id', userIds);
            if (usersError) throw usersError;
            const userMap = new Map(usersData.map(u => [u.id, u.name]));

            const { data: branchesData, error: branchesError } = await supabase.from('branches').select('id, name').in('id', branchIds);
            if (branchesError) throw branchesError;
            const branchMap = new Map(branchesData.map(b => [b.id, b.name]));

            setRecentCollections(collectionsData.map((r: Receipt) => ({
                ...r,
                customer_name: userMap.get(r.customer_id) || 'Unknown Customer',
                branch_name: branchMap.get(r.branch_id) || 'Unknown Branch',
            })));
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Optionally set an error state and show a toast
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const openModal = (type: 'branch' | 'customer' | 'group' | 'staff' | 'collection', data: any) => {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System-wide overview and controls
        </p>
      </div>

      {/* Organization Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium">Total Customers</p>
              <UsersIcon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.customerCount ?? '...'}
            </div>
          </div>
          <Link to="/super-admin/customers" className="mt-4 text-primary-600 hover:underline text-sm font-medium">View All Customers</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium">Active Chit Groups</p>
              <ClipboardDocumentListIcon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.groupCount ?? '...'}
            </div>
          </div>
          <Link to="/super-admin/groups" className="mt-4 text-primary-600 hover:underline text-sm font-medium">Manage Groups</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium">Total Staff</p>
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.staffCount ?? '...'}
            </div>
          </div>
          <Link to="/super-admin/staff" className="mt-4 text-primary-600 hover:underline text-sm font-medium">View All Staff</Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium">Total Collections</p>
              <CurrencyRupeeIcon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats ? formatCurrency(stats.totalCollections) : '...'}
            </div>
          </div>
          <Link to="/super-admin/collections" className="mt-4 text-primary-600 hover:underline text-sm font-medium">View Collections</Link>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Customers</h2>
            <Link to="/super-admin/customers/new" className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700">Add Customer</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.branch_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {customer.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/super-admin/customers/${customer.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Groups</h2>
            <Link to="/super-admin/groups/new" className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700">Add Group</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Group Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentGroups.map((group) => (
                    <tr key={group.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{group.group_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(group.chit_value)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {group.status}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/super-admin/groups/${group.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">View</Link>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Staff</h2>
            <Link to="/super-admin/staff/new" className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700">Add Staff</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentStaff.map((staff) => (
                    <tr key={staff.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{staff.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{staff.role}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {staff.status}
                            </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/super-admin/staff/${staff.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">View</Link>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Collections</h2>
            <Link to="/super-admin/collections/new" className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700">Add Collection</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentCollections.map((collection) => (
                    <tr key={collection.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{collection.customer_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{collection.branch_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(collection.amount)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                           <Link to={`/super-admin/collections/${collection.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">View</Link>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mr-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 mr-4">
              <BuildingOffice2Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 mr-4">
              <CurrencyRupeeIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Collection</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹2.5Cr</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mr-4">
              <CurrencyRupeeIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1.2Cr</p>
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
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Management</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              System Settings
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <UserIcon className="h-5 w-5 mr-2" />
              User Management
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <BellIcon className="h-5 w-5 mr-2" />
              System Notifications
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reports & Analytics</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
              Performance Metrics
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Financial Reports
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              User Analytics
            </button>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h2>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">System Status: Healthy</p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">All systems operational</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Last Backup: 2 hours ago</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Next scheduled: 22 hours</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Active Users: 156</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">Peak: 245 users</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chit Fund Analytics & Management */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Chit Group Management</h2>
          <ChitGroupConfig onSave={() => {}} onCancel={() => {}} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Branch Stats</h2>
          <BranchStats stats={{ totalCustomers: 120, activeLoans: 8, totalCollections: 2500000, onTimePayers: 100, defaulters: 5, availableFund: 500000 }} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-2">Analytics Dashboard</h2>
        <AdminAnalyticsDashboard branchId="all" />
      </div>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            {modalType === 'branch' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Branch Details: {modalData.name}</h2>
                <div className="mb-2">Customers: {modalData.customers || '-'}</div>
                <div className="mb-2">Groups: {modalData.groups || '-'}</div>
                <div className="mb-2">Staff: {modalData.staff || '-'}</div>
                <div className="mb-2">Collections: {modalData.collections ? `₹${modalData.collections.toLocaleString()}` : '-'}</div>
              </div>
            )}
            {modalType === 'customer' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Customer Details: {modalData.name}</h2>
                <div className="mb-2">Branch: {modalData.branch}</div>
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
                <div className="mb-2">Branch: {modalData.branch}</div>
                <div className="mb-2">Members: {modalData.members.join(', ')}</div>
                <div className="mb-2">Collection Status: {modalData.collectionStatus}</div>
              </div>
            )}
            {modalType === 'staff' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Staff Details: {modalData.name}</h2>
                <div className="mb-2">Branch: {modalData.branch}</div>
                <div className="mb-2">Role: {modalData.role}</div>
                <div className="mb-2">Assigned Groups: {modalData.groups.join(', ')}</div>
                <div className="mb-2">Collection Performance: {modalData.performance}</div>
              </div>
            )}
            {modalType === 'collection' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Collection Details</h2>
                <div className="mb-2">Customer: {modalData.customer}</div>
                <div className="mb-2">Branch: {modalData.branch}</div>
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

export default SuperAdminDashboard; 