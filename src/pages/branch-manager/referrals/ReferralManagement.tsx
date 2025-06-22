import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  UserPlusIcon, 
  ChartBarIcon, 
  CurrencyRupeeIcon,
  StarIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Referral {
  id: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: number;
  commission: number;
  date: string;
  notes?: string;
}

interface AgentStats {
  agentId: string;
  agentName: string;
  totalReferrals: number;
  approvedReferrals: number;
  totalCommission: number;
  thisMonthReferrals: number;
  thisMonthCommission: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

const ReferralManagement = () => {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockReferrals: Referral[] = [
      {
        id: '1',
        agentId: 'agent1',
        agentName: 'Rajesh Kumar',
        customerName: 'Priya Sharma',
        customerPhone: '+91 98765 43210',
        status: 'approved',
        amount: 50000,
        commission: 2500,
        date: '2024-01-15',
        notes: 'High-value customer, interested in gold loan'
      },
      {
        id: '2',
        agentId: 'agent2',
        agentName: 'Amit Patel',
        customerName: 'Suresh Reddy',
        customerPhone: '+91 87654 32109',
        status: 'pending',
        amount: 30000,
        commission: 1500,
        date: '2024-01-14',
        notes: 'New customer, needs guidance'
      },
      {
        id: '3',
        agentId: 'agent1',
        agentName: 'Rajesh Kumar',
        customerName: 'Lakshmi Devi',
        customerPhone: '+91 76543 21098',
        status: 'completed',
        amount: 75000,
        commission: 3750,
        date: '2024-01-13',
        notes: 'Existing customer, upgraded plan'
      },
      {
        id: '4',
        agentId: 'agent3',
        agentName: 'Sunita Verma',
        customerName: 'Krishna Rao',
        customerPhone: '+91 65432 10987',
        status: 'rejected',
        amount: 25000,
        commission: 0,
        date: '2024-01-12',
        notes: 'Documentation incomplete'
      }
    ];

    const mockAgentStats: AgentStats[] = [
      {
        agentId: 'agent1',
        agentName: 'Rajesh Kumar',
        totalReferrals: 45,
        approvedReferrals: 38,
        totalCommission: 95000,
        thisMonthReferrals: 12,
        thisMonthCommission: 25000,
        performance: 'excellent'
      },
      {
        agentId: 'agent2',
        agentName: 'Amit Patel',
        totalReferrals: 32,
        approvedReferrals: 28,
        totalCommission: 70000,
        thisMonthReferrals: 8,
        thisMonthCommission: 18000,
        performance: 'good'
      },
      {
        agentId: 'agent3',
        agentName: 'Sunita Verma',
        totalReferrals: 28,
        approvedReferrals: 22,
        totalCommission: 55000,
        thisMonthReferrals: 6,
        thisMonthCommission: 12000,
        performance: 'average'
      }
    ];

    setReferrals(mockReferrals);
    setAgentStats(mockAgentStats);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'average':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesFilter = filter === 'all' || referral.status === filter;
    const matchesSearch = referral.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.customerPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const totalStats = {
    totalReferrals: referrals.length,
    approvedReferrals: referrals.filter(r => r.status === 'approved' || r.status === 'completed').length,
    totalAmount: referrals.reduce((sum, r) => sum + r.amount, 0),
    totalCommission: referrals.reduce((sum, r) => sum + r.commission, 0)
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Referral Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track agent referrals and commissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlusIcon className="h-4 w-4" />
          Add New Referral
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Referrals</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.approvedReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {((totalStats.approvedReferrals / totalStats.totalReferrals) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CurrencyRupeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalStats.totalAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalStats.totalCommission / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="h-5 w-5" />
            Agent Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentStats.map((agent) => (
              <div key={agent.agentId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{agent.agentName}</h3>
                  <Badge className={getPerformanceColor(agent.performance)}>
                    {agent.performance}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Referrals:</span>
                    <span className="font-medium">{agent.totalReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                    <span className="font-medium text-green-600">{agent.approvedReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">This Month:</span>
                    <span className="font-medium">{agent.thisMonthReferrals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Commission:</span>
                    <span className="font-medium">₹{(agent.totalCommission / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Referral List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by customer or agent name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="filter">Status Filter</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Referrals Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {referral.agentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {referral.agentId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {referral.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {referral.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(referral.amount / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(referral.commission / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(referral.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReferrals.length === 0 && (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No referrals found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new referral.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralManagement; 