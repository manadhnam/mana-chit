import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  UserGroupIcon, 
  BanknotesIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ChitGroup {
  id: string;
  name: string;
  totalMembers: number;
  monthlyContribution: number;
  totalValue: number;
  duration: number; // in months
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  myPosition: number;
  nextAuctionDate?: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  totalPaid: number;
  remainingPayments: number;
  auctionWon?: boolean;
  auctionAmount?: number;
  auctionDate?: string;
}

const MyChitGroups = () => {
  const { user } = useAuthStore();
  const [chitGroups, setChitGroups] = useState<ChitGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockChitGroups: ChitGroup[] = [
      {
        id: '1',
        name: 'Gold Chit Group A',
        totalMembers: 20,
        monthlyContribution: 5000,
        totalValue: 100000,
        duration: 20,
        startDate: '2024-01-01',
        endDate: '2025-08-01',
        status: 'active',
        myPosition: 8,
        nextAuctionDate: '2024-02-15',
        lastPaymentDate: '2024-01-15',
        nextPaymentDate: '2024-02-15',
        totalPaid: 40000,
        remainingPayments: 12
      },
      {
        id: '2',
        name: 'Silver Chit Group B',
        totalMembers: 15,
        monthlyContribution: 3000,
        totalValue: 45000,
        duration: 15,
        startDate: '2023-06-01',
        endDate: '2024-08-01',
        status: 'active',
        myPosition: 3,
        auctionWon: true,
        auctionAmount: 42000,
        auctionDate: '2023-12-15',
        lastPaymentDate: '2024-01-15',
        nextPaymentDate: '2024-02-15',
        totalPaid: 27000,
        remainingPayments: 9
      },
      {
        id: '3',
        name: 'Platinum Chit Group C',
        totalMembers: 25,
        monthlyContribution: 8000,
        totalValue: 200000,
        duration: 25,
        startDate: '2022-03-01',
        endDate: '2024-03-01',
        status: 'completed',
        myPosition: 12,
        auctionWon: true,
        auctionAmount: 185000,
        auctionDate: '2023-06-15',
        lastPaymentDate: '2024-01-15',
        nextPaymentDate: '2024-02-15',
        totalPaid: 200000,
        remainingPayments: 0
      },
      {
        id: '4',
        name: 'Diamond Chit Group D',
        totalMembers: 30,
        monthlyContribution: 10000,
        totalValue: 300000,
        duration: 30,
        startDate: '2024-03-01',
        endDate: '2026-08-01',
        status: 'upcoming',
        myPosition: 1,
        nextAuctionDate: '2024-04-15',
        lastPaymentDate: '2024-01-15',
        nextPaymentDate: '2024-02-15',
        totalPaid: 10000,
        remainingPayments: 29
      }
    ];

    setChitGroups(mockChitGroups);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPositionColor = (position: number, totalMembers: number) => {
    const percentage = (position / totalMembers) * 100;
    if (percentage <= 25) return 'text-green-600 dark:text-green-400';
    if (percentage <= 50) return 'text-blue-600 dark:text-blue-400';
    if (percentage <= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredChitGroups = chitGroups.filter(group => {
    const matchesFilter = filter === 'all' || group.status === filter;
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalStats = {
    totalGroups: chitGroups.length,
    activeGroups: chitGroups.filter(g => g.status === 'active').length,
    completedGroups: chitGroups.filter(g => g.status === 'completed').length,
    totalInvestment: chitGroups.reduce((sum, g) => sum + g.totalPaid, 0),
    totalValue: chitGroups.reduce((sum, g) => sum + g.totalValue, 0)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Chit Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your chit fund investments</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserGroupIcon className="h-4 w-4" />
          Join New Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              All time groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStats.completedGroups}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalStats.totalInvestment / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              Total amount paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(totalStats.totalValue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              Total group value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chit Groups List */}
      <Card>
        <CardHeader>
          <CardTitle>Chit Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by group name..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chit Groups Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>My Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChitGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {group.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{(group.totalValue / 1000).toFixed(1)}K • {group.duration} months
                        </div>
                        {group.auctionWon && (
                          <div className="text-sm text-green-600 dark:text-green-400">
                            Won auction: ₹{(group.auctionAmount! / 1000).toFixed(1)}K
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="h-4 w-4 text-gray-400" />
                        {group.totalMembers}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(group.monthlyContribution / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${getPositionColor(group.myPosition, group.totalMembers)}`}>
                        {group.myPosition}/{group.totalMembers}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {((group.myPosition / group.totalMembers) * 100).toFixed(0)}% complete
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(group.status)}>
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(group.nextPaymentDate).toLocaleDateString()}
                      </div>
                      {group.remainingPayments > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {group.remainingPayments} payments left
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <ChartBarIcon className="h-3 w-3" />
                          Details
                        </Button>
                        {group.status === 'active' && (
                          <Button size="sm" className="flex items-center gap-1">
                            <BanknotesIcon className="h-3 w-3" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredChitGroups.length === 0 && (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No chit groups found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by joining a chit group.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Make Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pay your monthly contribution</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">View Reports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check your payment history</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Join New Group</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explore available groups</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyChitGroups; 