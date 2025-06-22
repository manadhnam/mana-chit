import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  BanknotesIcon, 
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Loan {
  id: string;
  loanNumber: string;
  type: 'personal' | 'business' | 'gold' | 'property' | 'vehicle';
  amount: number;
  interestRate: number;
  tenure: number; // in months
  emiAmount: number;
  disbursedAmount: number;
  status: 'active' | 'completed' | 'overdue' | 'defaulted';
  disbursalDate: string;
  dueDate: string;
  nextEmiDate: string;
  totalEmis: number;
  paidEmis: number;
  remainingEmis: number;
  totalPaid: number;
  outstandingAmount: number;
  lastPaymentDate?: string;
  nextPaymentAmount: number;
  processingFee: number;
  lateFees: number;
}

const MyLoans = () => {
  const { user } = useAuthStore();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockLoans: Loan[] = [
      {
        id: '1',
        loanNumber: 'LON001',
        type: 'personal',
        amount: 500000,
        interestRate: 12.5,
        tenure: 36,
        emiAmount: 16750,
        disbursedAmount: 485000,
        status: 'active',
        disbursalDate: '2023-06-15',
        dueDate: '2026-06-15',
        nextEmiDate: '2024-02-15',
        totalEmis: 36,
        paidEmis: 8,
        remainingEmis: 28,
        totalPaid: 134000,
        outstandingAmount: 366000,
        lastPaymentDate: '2024-01-15',
        nextPaymentAmount: 16750,
        processingFee: 15000,
        lateFees: 0
      },
      {
        id: '2',
        loanNumber: 'LON002',
        type: 'gold',
        amount: 200000,
        interestRate: 10.5,
        tenure: 24,
        emiAmount: 9250,
        disbursedAmount: 190000,
        status: 'active',
        disbursalDate: '2023-09-01',
        dueDate: '2025-09-01',
        nextEmiDate: '2024-02-01',
        totalEmis: 24,
        paidEmis: 5,
        remainingEmis: 19,
        totalPaid: 46250,
        outstandingAmount: 143750,
        lastPaymentDate: '2024-01-01',
        nextPaymentAmount: 9250,
        processingFee: 10000,
        lateFees: 0
      },
      {
        id: '3',
        loanNumber: 'LON003',
        type: 'business',
        amount: 1000000,
        interestRate: 14.0,
        tenure: 60,
        emiAmount: 23250,
        disbursedAmount: 950000,
        status: 'overdue',
        disbursalDate: '2022-03-01',
        dueDate: '2027-03-01',
        nextEmiDate: '2024-01-15',
        totalEmis: 60,
        paidEmis: 22,
        remainingEmis: 38,
        totalPaid: 511500,
        outstandingAmount: 488500,
        lastPaymentDate: '2023-12-15',
        nextPaymentAmount: 24250,
        processingFee: 50000,
        lateFees: 1500
      },
      {
        id: '4',
        loanNumber: 'LON004',
        type: 'vehicle',
        amount: 300000,
        interestRate: 11.0,
        tenure: 48,
        emiAmount: 7750,
        disbursedAmount: 285000,
        status: 'completed',
        disbursalDate: '2019-06-01',
        dueDate: '2023-06-01',
        nextEmiDate: '2023-06-01',
        totalEmis: 48,
        paidEmis: 48,
        remainingEmis: 0,
        totalPaid: 372000,
        outstandingAmount: 0,
        lastPaymentDate: '2023-06-01',
        nextPaymentAmount: 0,
        processingFee: 15000,
        lateFees: 0
      }
    ];

    setLoans(mockLoans);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'defaulted':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'business':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'property':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'vehicle':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesFilter = filter === 'all' || loan.status === filter;
    const matchesSearch = loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalStats = {
    totalLoans: loans.length,
    activeLoans: loans.filter(l => l.status === 'active').length,
    completedLoans: loans.filter(l => l.status === 'completed').length,
    overdueLoans: loans.filter(l => l.status === 'overdue').length,
    totalBorrowed: loans.reduce((sum, l) => sum + l.disbursedAmount, 0),
    totalOutstanding: loans.reduce((sum, l) => sum + l.outstandingAmount, 0),
    totalPaid: loans.reduce((sum, l) => sum + l.totalPaid, 0)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Loans</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your loan accounts</p>
        </div>
        <Button className="flex items-center gap-2">
          <BanknotesIcon className="h-4 w-4" />
          Apply for New Loan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalLoans}</div>
            <p className="text-xs text-muted-foreground">
              All time loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(totalStats.totalOutstanding / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(totalStats.totalPaid / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total amount paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loans List */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by loan number or type..."
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
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loans Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>EMI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {loan.loanNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan
                        </div>
                        <Badge className={getTypeColor(loan.type)}>
                          {loan.type.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          ₹{(loan.amount / 100000).toFixed(1)}L
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {loan.interestRate}% p.a.
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          ₹{(loan.emiAmount / 1000).toFixed(1)}K
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {loan.tenure} months
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </Badge>
                      {loan.lateFees > 0 && (
                        <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Late fees: ₹{loan.lateFees}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(loan.nextEmiDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{(loan.nextPaymentAmount / 1000).toFixed(1)}K
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {loan.paidEmis}/{loan.totalEmis} EMIs
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(loan.paidEmis / loan.totalEmis) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((loan.paidEmis / loan.totalEmis) * 100).toFixed(0)}% complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <ChartBarIcon className="h-3 w-3" />
                          Details
                        </Button>
                        {loan.status === 'active' && (
                          <Button size="sm" className="flex items-center gap-1">
                            <BanknotesIcon className="h-3 w-3" />
                            Pay EMI
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-8">
              <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No loans found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by applying for a loan.'}
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
                <h3 className="font-semibold text-gray-900 dark:text-white">Pay EMI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Make your monthly payment</p>
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
                <h3 className="font-semibold text-gray-900 dark:text-white">Loan Statement</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download payment history</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Apply for Loan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get a new loan</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyLoans; 