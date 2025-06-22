import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BanknotesIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
  ArcElement,
  BarElement
);

interface FinancialOverview {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  pendingCollections: number;
  overdueAmount: number;
  riskExposure: number;
}

interface BranchFinancial {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  collections: number;
  pendingCollections: number;
  budgetUtilization: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'profitable' | 'break_even' | 'loss';
}

interface FinancialAlert {
  id: string;
  type: 'overdue' | 'budget_exceeded' | 'low_cash_flow' | 'high_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  branchId?: string;
  amount?: number;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
}

const FinancialOversight: React.FC = () => {
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [branches, setBranches] = useState<BranchFinancial[]>([]);
  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data
  useEffect(() => {
    const mockOverview: FinancialOverview = {
      totalAssets: 150000000,
      totalLiabilities: 80000000,
      netWorth: 70000000,
      totalRevenue: 45000000,
      totalExpenses: 32000000,
      netProfit: 13000000,
      cashFlow: 8500000,
      pendingCollections: 12000000,
      overdueAmount: 3500000,
      riskExposure: 8500000
    };

    const mockBranches: BranchFinancial[] = [
      {
        id: '1',
        name: 'Mumbai Central',
        revenue: 25000000,
        expenses: 18000000,
        profit: 7000000,
        collections: 22000000,
        pendingCollections: 3000000,
        budgetUtilization: 85,
        riskLevel: 'low',
        status: 'profitable'
      },
      {
        id: '2',
        name: 'Andheri West',
        revenue: 18000000,
        expenses: 14000000,
        profit: 4000000,
        collections: 16500000,
        pendingCollections: 1500000,
        budgetUtilization: 92,
        riskLevel: 'medium',
        status: 'profitable'
      },
      {
        id: '3',
        name: 'Bandra East',
        revenue: 12000000,
        expenses: 11000000,
        profit: 1000000,
        collections: 10000000,
        pendingCollections: 2000000,
        budgetUtilization: 78,
        riskLevel: 'high',
        status: 'break_even'
      }
    ];

    const mockAlerts: FinancialAlert[] = [
      {
        id: '1',
        type: 'overdue',
        severity: 'high',
        title: 'High Overdue Collections',
        description: 'Bandra East branch has ₹20L overdue collections',
        branchId: '3',
        amount: 2000000,
        status: 'open',
        createdAt: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        type: 'budget_exceeded',
        severity: 'medium',
        title: 'Budget Exceeded',
        description: 'Andheri West branch exceeded budget by 8%',
        branchId: '2',
        amount: 1200000,
        status: 'acknowledged',
        createdAt: '2024-03-14T14:30:00Z'
      }
    ];

    setTimeout(() => {
      setOverview(mockOverview);
      setBranches(mockBranches);
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const profitLossData = {
    labels: branches.map(branch => branch.name),
    datasets: [
      {
        label: 'Revenue',
        data: branches.map(branch => branch.revenue / 1000000),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: branches.map(branch => branch.expenses / 1000000),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      }
    ]
  };

  const cashFlowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Cash Flow (₹L)',
      data: [45, 52, 58, 65, 72, 85],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      data: [
        branches.filter(b => b.riskLevel === 'low').length,
        branches.filter(b => b.riskLevel === 'medium').length,
        branches.filter(b => b.riskLevel === 'high').length
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const handleAllocation = () => {
    toast.success('Fund allocation completed');
    setShowAllocationModal(false);
  };

  const handleRiskMitigation = () => {
    toast.success('Risk mitigation measures applied');
    setShowRiskModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'profitable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'break_even': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'loss': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading || !overview) {
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
          Financial Oversight
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive financial monitoring and control across all operations
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Worth
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(overview.netWorth / 10000000).toFixed(1)}Cr
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
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Profit
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(overview.netProfit / 1000000).toFixed(1)}M
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
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Collections
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(overview.pendingCollections / 1000000).toFixed(1)}M
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
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Risk Exposure
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(overview.riskExposure / 1000000).toFixed(1)}M
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
            Branch Profit & Loss
          </h2>
          <div className="h-64">
            <Bar 
              data={profitLossData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
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
            Cash Flow Trend
          </h2>
          <div className="h-64">
            <Line 
              data={cashFlowData} 
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

      {/* Risk Distribution */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Risk Distribution Across Branches
        </h2>
        <div className="h-64">
          <Doughnut 
            data={riskDistributionData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
              cutout: '60%',
            }}
          />
        </div>
      </motion.div>

      {/* Financial Alerts */}
      {alerts.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Alerts</h2>
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

      {/* Branch Financial Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Financial Performance</h2>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAllocationModal(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Allocate Funds
            </Button>
            <Button variant="outline" onClick={() => setShowRiskModal(true)}>
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Risk Mitigation
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Collections</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Budget Util.</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>₹{(branch.revenue / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(branch.expenses / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(branch.profit / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(branch.collections / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(branch.pendingCollections / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>{branch.budgetUtilization}%</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(branch.riskLevel)}>
                      {branch.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(branch.status)}>
                      {branch.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Fund Allocation Dialog */}
      <Dialog open={showAllocationModal} onOpenChange={setShowAllocationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="branch">Select Branch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Allocation Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" placeholder="Enter purpose" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocationModal(false)}>Cancel</Button>
            <Button onClick={handleAllocation}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Mitigation Dialog */}
      <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risk Mitigation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="riskType">Risk Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overdue">Overdue Collections</SelectItem>
                  <SelectItem value="budget">Budget Exceeded</SelectItem>
                  <SelectItem value="cashflow">Low Cash Flow</SelectItem>
                  <SelectItem value="operational">Operational Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mitigationAction">Mitigation Action</Label>
              <Input id="mitigationAction" placeholder="Enter mitigation action" />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" placeholder="Enter timeline" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRiskModal(false)}>Cancel</Button>
            <Button onClick={handleRiskMitigation}>Apply Measures</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialOversight; 