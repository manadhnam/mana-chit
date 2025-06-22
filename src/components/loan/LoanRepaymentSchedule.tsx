import React, { useState } from 'react';
import { 
  CalendarIcon, 
  BanknotesIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EMI {
  emiNumber: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  status: 'paid' | 'pending' | 'overdue' | 'upcoming';
  paidDate?: string;
  lateFees?: number;
  remarks?: string;
}

interface LoanRepaymentScheduleProps {
  loanId: string;
  loanAmount: number;
  emiAmount: number;
  totalEmis: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  emis: EMI[];
  onPayEmi?: (emiNumber: number) => void;
  onViewDetails?: (emiNumber: number) => void;
}

const LoanRepaymentSchedule: React.FC<LoanRepaymentScheduleProps> = ({
  loanId,
  loanAmount,
  emiAmount,
  totalEmis,
  interestRate,
  startDate,
  endDate,
  emis,
  onPayEmi,
  onViewDetails
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredEmis = emis.filter(emi => {
    if (filter === 'all') return true;
    return emi.status === filter;
  });

  const totalPaid = emis.filter(emi => emi.status === 'paid').length;
  const totalPending = emis.filter(emi => emi.status === 'pending').length;
  const totalOverdue = emis.filter(emi => emi.status === 'overdue').length;
  const totalAmountPaid = emis.filter(emi => emi.status === 'paid').reduce((sum, emi) => sum + emi.amount, 0);
  const totalOutstanding = emis.filter(emi => emi.status !== 'paid').reduce((sum, emi) => sum + emi.amount, 0);

  return (
    <div className="space-y-6">
      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5" />
            Loan Repayment Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(loanAmount / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ₹{(emiAmount / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalPaid}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">EMIs Paid</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{totalOverdue}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Interest Rate:</span>
                <span className="font-medium">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total EMIs:</span>
                <span className="font-medium">{totalEmis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                <span className="font-medium">{new Date(startDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                <span className="font-medium text-green-600">₹{(totalAmountPaid / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Outstanding:</span>
                <span className="font-medium text-red-600">₹{(totalOutstanding / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                <span className="font-medium">{new Date(endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EMI Schedule */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>EMI Schedule</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({emis.length})
              </Button>
              <Button
                variant={filter === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('paid')}
              >
                Paid ({totalPaid})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({totalPending})
              </Button>
              <Button
                variant={filter === 'overdue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('overdue')}
              >
                Overdue ({totalOverdue})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EMI #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmis.map((emi) => (
                  <TableRow key={emi.emiNumber}>
                    <TableCell className="font-medium">
                      {emi.emiNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(emi.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(emi.amount / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      ₹{(emi.principal / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      ₹{(emi.interest / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getStatusColor(emi.status)}>
                          {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                        </Badge>
                        {emi.lateFees && emi.lateFees > 0 && (
                          <div className="text-xs text-red-600">
                            Late fees: ₹{emi.lateFees}
                          </div>
                        )}
                        {emi.paidDate && (
                          <div className="text-xs text-gray-500">
                            Paid: {new Date(emi.paidDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {emi.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => onPayEmi?.(emi.emiNumber)}
                            className="flex items-center gap-1"
                          >
                            <BanknotesIcon className="h-3 w-3" />
                            Pay
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewDetails?.(emi.emiNumber)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmis.length === 0 && (
            <div className="text-center py-8">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No EMIs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{((totalPaid / totalEmis) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(totalPaid / totalEmis) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-600">{totalPaid}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Paid</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <ClockIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-yellow-600">{totalPending}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-600">{totalOverdue}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanRepaymentSchedule; 