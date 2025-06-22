import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BanknotesIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

interface Fund {
  id: string;
  name: string;
  type: 'operational' | 'investment' | 'emergency' | 'reserve';
  totalAmount: number;
  allocatedAmount: number;
  availableAmount: number;
  branches: {
    branchId: string;
    branchName: string;
    allocated: number;
    utilized: number;
    remaining: number;
  }[];
  status: 'active' | 'frozen' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface FundTransaction {
  id: string;
  fundId: string;
  type: 'allocation' | 'withdrawal' | 'transfer' | 'interest';
  amount: number;
  fromBranch?: string;
  toBranch?: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

const FundsManagement: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [showAddFund, setShowAddFund] = useState(false);
  const [showAllocateFund, setShowAllocateFund] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data
  useEffect(() => {
    const mockFunds: Fund[] = [
      {
        id: '1',
        name: 'Operational Fund',
        type: 'operational',
        totalAmount: 50000000,
        allocatedAmount: 35000000,
        availableAmount: 15000000,
        branches: [
          { branchId: '1', branchName: 'Mumbai Central', allocated: 10000000, utilized: 8500000, remaining: 1500000 },
          { branchId: '2', branchName: 'Andheri West', allocated: 8000000, utilized: 7200000, remaining: 800000 },
          { branchId: '3', branchName: 'Bandra East', allocated: 7000000, utilized: 6300000, remaining: 700000 },
        ],
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15',
      },
      {
        id: '2',
        name: 'Investment Fund',
        type: 'investment',
        totalAmount: 20000000,
        allocatedAmount: 15000000,
        availableAmount: 5000000,
        branches: [
          { branchId: '1', branchName: 'Mumbai Central', allocated: 5000000, utilized: 4500000, remaining: 500000 },
          { branchId: '2', branchName: 'Andheri West', allocated: 4000000, utilized: 3600000, remaining: 400000 },
        ],
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15',
      },
      {
        id: '3',
        name: 'Emergency Fund',
        type: 'emergency',
        totalAmount: 10000000,
        allocatedAmount: 0,
        availableAmount: 10000000,
        branches: [],
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15',
      },
    ];

    const mockTransactions: FundTransaction[] = [
      {
        id: '1',
        fundId: '1',
        type: 'allocation',
        amount: 5000000,
        toBranch: 'Mumbai Central',
        description: 'Monthly operational allocation',
        timestamp: '2024-03-15T10:00:00Z',
        status: 'completed',
      },
      {
        id: '2',
        fundId: '1',
        type: 'withdrawal',
        amount: 1000000,
        fromBranch: 'Andheri West',
        description: 'Infrastructure upgrade',
        timestamp: '2024-03-14T14:30:00Z',
        status: 'completed',
      },
    ];

    setTimeout(() => {
      setFunds(mockFunds);
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const totalFunds = funds.reduce((sum, fund) => sum + fund.totalAmount, 0);
  const totalAllocated = funds.reduce((sum, fund) => sum + fund.allocatedAmount, 0);
  const totalAvailable = funds.reduce((sum, fund) => sum + fund.availableAmount, 0);

  const fundTypeData = {
    labels: funds.map(fund => fund.name),
    datasets: [{
      data: funds.map(fund => fund.totalAmount),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const utilizationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Fund Utilization',
      data: [65, 70, 75, 80, 85, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  };

  const handleAddFund = () => {
    toast.success('Fund added successfully');
    setShowAddFund(false);
  };

  const handleAllocateFund = () => {
    toast.success('Fund allocated successfully');
    setShowAllocateFund(false);
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
          Funds Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and monitor all funds across branches
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
              <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Funds
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalFunds / 1000000).toFixed(1)}M
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
              <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Allocated
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalAllocated / 1000000).toFixed(1)}M
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
              <BuildingOfficeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{(totalAvailable / 1000000).toFixed(1)}M
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
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Utilization Rate
              </h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {((totalAllocated / totalFunds) * 100).toFixed(1)}%
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
            Fund Distribution
          </h2>
          <div className="h-64">
            <Doughnut 
              data={fundTypeData} 
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

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fund Utilization Trend
          </h2>
          <div className="h-64">
            <Line 
              data={utilizationData} 
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
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Funds Table */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fund Details</h2>
          <Button onClick={() => setShowAddFund(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Fund
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((fund) => (
                <TableRow key={fund.id}>
                  <TableCell className="font-medium">{fund.name}</TableCell>
                  <TableCell>
                    <Badge variant={fund.type === 'operational' ? 'default' : fund.type === 'investment' ? 'secondary' : 'outline'}>
                      {fund.type}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{(fund.totalAmount / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(fund.allocatedAmount / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>₹{(fund.availableAmount / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>
                    <Badge variant={fund.status === 'active' ? 'default' : fund.status === 'frozen' ? 'secondary' : 'destructive'}>
                      {fund.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedFund(fund)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowAllocateFund(true)}>
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

      {/* Recent Transactions */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Badge variant={transaction.type === 'allocation' ? 'default' : transaction.type === 'withdrawal' ? 'secondary' : 'outline'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{(transaction.amount / 1000000).toFixed(1)}M</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.toBranch || transaction.fromBranch || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Add Fund Dialog */}
      <Dialog open={showAddFund} onOpenChange={setShowAddFund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fundName">Fund Name</Label>
              <Input id="fundName" placeholder="Enter fund name" />
            </div>
            <div>
              <Label htmlFor="fundType">Fund Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select fund type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="reserve">Reserve</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Initial Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFund(false)}>Cancel</Button>
            <Button onClick={handleAddFund}>Add Fund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Fund Dialog */}
      <Dialog open={showAllocateFund} onOpenChange={setShowAllocateFund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Fund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="branch">Select Branch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mumbai Central</SelectItem>
                  <SelectItem value="2">Andheri West</SelectItem>
                  <SelectItem value="3">Bandra East</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allocateAmount">Allocation Amount</Label>
              <Input id="allocateAmount" type="number" placeholder="Enter amount" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocateFund(false)}>Cancel</Button>
            <Button onClick={handleAllocateFund}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundsManagement; 