import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  BanknotesIcon, 
  CreditCardIcon,
  QrCodeIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'cheque';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'chit_payment' | 'loan_emi' | 'processing_fee' | 'other';
  dueDate: string;
  paidDate?: string;
  reference?: string;
  notes?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  enabled: boolean;
}

const CollectPayment = () => {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash',
      icon: BanknotesIcon,
      description: 'Collect cash payment',
      enabled: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: QrCodeIcon,
      description: 'Scan QR code or UPI ID',
      enabled: true
    },
    {
      id: 'card',
      name: 'Card',
      icon: CreditCardIcon,
      description: 'Credit/Debit card payment',
      enabled: true
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: DocumentTextIcon,
      description: 'NEFT/RTGS/IMPS transfer',
      enabled: true
    },
    {
      id: 'cheque',
      name: 'Cheque',
      icon: DocumentTextIcon,
      description: 'Cheque payment',
      enabled: true
    }
  ];

  // Mock data
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: '1',
        customerId: 'cust1',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91 98765 43210',
        amount: 5000,
        paymentMethod: 'cash',
        status: 'pending',
        type: 'chit_payment',
        dueDate: '2024-01-20',
        notes: 'Monthly chit payment'
      },
      {
        id: '2',
        customerId: 'cust2',
        customerName: 'Priya Sharma',
        customerPhone: '+91 87654 32109',
        amount: 3000,
        paymentMethod: 'upi',
        status: 'completed',
        type: 'loan_emi',
        dueDate: '2024-01-18',
        paidDate: '2024-01-18',
        reference: 'UPI123456789',
        notes: 'Loan EMI payment'
      },
      {
        id: '3',
        customerId: 'cust3',
        customerName: 'Amit Patel',
        customerPhone: '+91 76543 21098',
        amount: 7500,
        paymentMethod: 'cash',
        status: 'completed',
        type: 'chit_payment',
        dueDate: '2024-01-15',
        paidDate: '2024-01-15',
        notes: 'Chit payment with late fee'
      },
      {
        id: '4',
        customerId: 'cust4',
        customerName: 'Sunita Verma',
        customerPhone: '+91 65432 10987',
        amount: 2000,
        paymentMethod: 'card',
        status: 'failed',
        type: 'processing_fee',
        dueDate: '2024-01-17',
        notes: 'Card declined'
      }
    ];

    setPayments(mockPayments);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chit_payment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'loan_emi':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'processing_fee':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'other':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === method);
    return paymentMethod ? paymentMethod.icon : BanknotesIcon;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const totalStats = {
    totalPayments: payments.length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    collectedAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  };

  const handleCollectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async (paymentMethod: string, reference?: string) => {
    if (!selectedPayment) return;

    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedPayment: Payment = {
      ...selectedPayment,
      paymentMethod: paymentMethod as any,
      status: 'completed',
      paidDate: new Date().toISOString().split('T')[0],
      reference: reference || `REF${Date.now()}`
    };

    setPayments(prev => prev.map(p => p.id === selectedPayment.id ? updatedPayment : p));
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setProcessingPayment(false);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collect Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">Process payments from customers</p>
        </div>
        <Button className="flex items-center gap-2">
          <BanknotesIcon className="h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              All time payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalStats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.completedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalStats.totalAmount / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              All payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(totalStats.collectedAmount / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              Successfully collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <method.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{method.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                  </div>
                  <Badge variant={method.enabled ? "default" : "secondary"}>
                    {method.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by customer name or phone..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {payment.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(payment.amount / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(payment.type)}>
                        {payment.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCollectPayment(payment)}
                            className="flex items-center gap-1"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                            Collect
                          </Button>
                        )}
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'No payments to display.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collect Payment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                <XCircleIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPayment.customerName} ({selectedPayment.customerPhone})
                </div>
              </div>

              <div>
                <Label>Amount</Label>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  ₹{(selectedPayment.amount / 1000).toFixed(1)}K
                </div>
              </div>

              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {paymentMethods.filter(pm => pm.enabled).map((method) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => processPayment(method.id)}
                      disabled={processingPayment}
                    >
                      <method.icon className="h-4 w-4" />
                      {method.name}
                    </Button>
                  ))}
                </div>
              </div>

              {processingPayment && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Processing payment...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectPayment; 