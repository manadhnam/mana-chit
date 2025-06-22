import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  manager: {
    id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  financialMetrics: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    budgetUtilization: number;
    collectionsThisMonth: number;
    pendingCollections: number;
  };
  performanceMetrics: {
    customerCount: number;
    staffCount: number;
    chitGroups: number;
    activeLoans: number;
    onTimePayments: number;
    defaulters: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdated: string;
}

interface BranchAlert {
  id: string;
  branchId: string;
  type: 'financial' | 'operational' | 'compliance' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

const EnhancedBranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [alerts, setAlerts] = useState<BranchAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  // Mock data
  useEffect(() => {
    const mockBranches: Branch[] = [
      {
        id: '1',
        name: 'Mumbai Central',
        code: 'MC001',
        address: '123 Main Street, Mumbai Central, Mumbai',
        phone: '+91-22-12345678',
        email: 'mumbai.central@manachit.com',
        manager: {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@manachit.com'
        },
        status: 'active',
        financialMetrics: {
          totalRevenue: 25000000,
          totalExpenses: 18000000,
          netProfit: 7000000,
          budgetUtilization: 85,
          collectionsThisMonth: 3500000,
          pendingCollections: 500000
        },
        performanceMetrics: {
          customerCount: 1250,
          staffCount: 25,
          chitGroups: 45,
          activeLoans: 180,
          onTimePayments: 1150,
          defaulters: 15
        },
        riskLevel: 'low',
        createdAt: '2023-01-15',
        lastUpdated: '2024-03-15'
      },
      {
        id: '2',
        name: 'Andheri West',
        code: 'AW002',
        address: '456 Andheri Road, Andheri West, Mumbai',
        phone: '+91-22-87654321',
        email: 'andheri.west@manachit.com',
        manager: {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@manachit.com'
        },
        status: 'active',
        financialMetrics: {
          totalRevenue: 18000000,
          totalExpenses: 14000000,
          netProfit: 4000000,
          budgetUtilization: 92,
          collectionsThisMonth: 2800000,
          pendingCollections: 750000
        },
        performanceMetrics: {
          customerCount: 980,
          staffCount: 18,
          chitGroups: 32,
          activeLoans: 145,
          onTimePayments: 920,
          defaulters: 25
        },
        riskLevel: 'medium',
        createdAt: '2023-03-20',
        lastUpdated: '2024-03-14'
      },
      {
        id: '3',
        name: 'Bandra East',
        code: 'BE003',
        address: '789 Bandra Road, Bandra East, Mumbai',
        phone: '+91-22-11223344',
        email: 'bandra.east@manachit.com',
        manager: {
          id: '3',
          name: 'Amit Patel',
          email: 'amit.patel@manachit.com'
        },
        status: 'active',
        financialMetrics: {
          totalRevenue: 12000000,
          totalExpenses: 11000000,
          netProfit: 1000000,
          budgetUtilization: 78,
          collectionsThisMonth: 1800000,
          pendingCollections: 1200000
        },
        performanceMetrics: {
          customerCount: 650,
          staffCount: 12,
          chitGroups: 20,
          activeLoans: 95,
          onTimePayments: 580,
          defaulters: 45
        },
        riskLevel: 'high',
        createdAt: '2023-06-10',
        lastUpdated: '2024-03-13'
      }
    ];

    const mockAlerts: BranchAlert[] = [
      {
        id: '1',
        branchId: '3',
        type: 'financial',
        severity: 'high',
        title: 'High Pending Collections',
        description: 'Bandra East branch has ₹12L pending collections exceeding threshold',
        status: 'open',
        createdAt: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        branchId: '2',
        type: 'operational',
        severity: 'medium',
        title: 'Staff Shortage',
        description: 'Andheri West branch needs additional staff for peak hours',
        status: 'in_progress',
        createdAt: '2024-03-14T14:30:00Z'
      }
    ];

    setTimeout(() => {
      setBranches(mockBranches);
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const totalRevenue = branches.reduce((sum, branch) => sum + branch.financialMetrics.totalRevenue, 0);
  const totalProfit = branches.reduce((sum, branch) => sum + branch.financialMetrics.netProfit, 0);
  const totalCustomers = branches.reduce((sum, branch) => sum + branch.performanceMetrics.customerCount, 0);
  const totalCollections = branches.reduce((sum, branch) => sum + branch.financialMetrics.collectionsThisMonth, 0);

  const performanceData = {
    labels: branches.map(branch => branch.name),
    datasets: [{
      label: 'Revenue (₹L)',
      data: branches.map(branch => branch.financialMetrics.totalRevenue / 100000),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  const collectionsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Collections (₹L)',
      data: [25, 28, 32, 35, 38, 42],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
    }]
  };

  const handleAddBranch = () => {
    toast.success('Branch added successfully');
    setShowAddBranch(false);
  };

  const handleFinancialReview = () => {
    toast.success('Financial review completed');
    setShowFinancialModal(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredBranches = branches.filter(branch => {
    const statusMatch = filterStatus === 'all' || branch.status === filterStatus;
    const riskMatch = filterRisk === 'all' || branch.riskLevel === filterRisk;
    return statusMatch && riskMatch;
  });

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
          Enhanced Branch Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive oversight of all branches with financial controls
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalRevenue / 10000000).toFixed(1)}Cr
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Profit
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalProfit / 1000000).toFixed(1)}M
              </p>
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
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Customers
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalCustomers.toLocaleString()}
              </p>
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
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Collections
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalCollections / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Branch Revenue Comparison
          </h2>
          <div className="h-64">
            <Bar 
              data={performanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Collections Trend
          </h2>
          <div className="h-64">
            <Line 
              data={collectionsData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h2>
            <Badge variant="destructive">{alerts.length}</Badge>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">{alert.title}</p>
                  <p className="text-xs text-red-600 dark:text-red-500">{alert.description}</p>
                </div>
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowAddBranch(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Branches Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Financial Metrics</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-sm text-gray-500">{branch.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{branch.manager.name}</p>
                      <p className="text-sm text-gray-500">{branch.manager.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">Revenue: ₹{(branch.financialMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm">Profit: ₹{(branch.financialMetrics.netProfit / 1000000).toFixed(1)}M</p>
                      <p className="text-sm">Budget: {branch.financialMetrics.budgetUtilization}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">Customers: {branch.performanceMetrics.customerCount}</p>
                      <p className="text-sm">Groups: {branch.performanceMetrics.chitGroups}</p>
                      <p className="text-sm">On-time: {((branch.performanceMetrics.onTimePayments / branch.performanceMetrics.customerCount) * 100).toFixed(1)}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(branch.riskLevel)}>
                      {branch.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(branch.status)}>
                      {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedBranch(branch)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowFinancialModal(true)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Add Branch Dialog */}
      <Dialog open={showAddBranch} onOpenChange={setShowAddBranch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="branchName">Branch Name</Label>
              <Input id="branchName" placeholder="Enter branch name" />
            </div>
            <div>
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input id="branchCode" placeholder="Enter branch code" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter address" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBranch(false)}>Cancel</Button>
            <Button onClick={handleAddBranch}>Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Financial Review Dialog */}
      <Dialog open={showFinancialModal} onOpenChange={setShowFinancialModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Financial Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">Budget Allocation</Label>
              <Input id="budget" type="number" placeholder="Enter budget amount" />
            </div>
            <div>
              <Label htmlFor="expenseLimit">Expense Limit</Label>
              <Input id="expenseLimit" type="number" placeholder="Enter expense limit" />
            </div>
            <div>
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Input id="reviewNotes" placeholder="Enter review notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinancialModal(false)}>Cancel</Button>
            <Button onClick={handleFinancialReview}>Complete Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedBranchManagement; 