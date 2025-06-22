import {UserIcon, DocumentTextIcon, CreditCardIcon} from '@heroicons/react/24/outline';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';



interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'upi' | 'cash';
  name: string;
  details: string;
}

interface Payment {
  id: string;
  type: 'loan' | 'chit';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  referenceId: string;
}

const MakePayment: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with actual API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock payment methods
        const mockMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'bank_transfer',
            name: 'Bank Transfer',
            details: 'HDFC Bank - XXXX1234',
          },
          {
            id: '2',
            type: 'upi',
            name: 'UPI',
            details: 'user@upi',
          },
          {
            id: '3',
            type: 'cash',
            name: 'Cash',
            details: 'Visit nearest branch',
          },
        ];

        // Mock pending payments
        const mockPayments: Payment[] = [
          {
            id: 'P001',
            type: 'loan',
            amount: 5000,
            dueDate: '2024-04-15',
            status: 'pending',
            referenceId: 'LOAN123',
          },
          {
            id: 'P002',
            type: 'chit',
            amount: 3000,
            dueDate: '2024-04-20',
            status: 'pending',
            referenceId: 'CHIT456',
          },
        ];
        
        setPaymentMethods(mockMethods);
        setPendingPayments(mockPayments);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment || !selectedMethod) return;

    try {
      // Implement payment logic here
      console.log('Processing payment:', {
        payment: selectedPayment,
        method: selectedMethod,
      });
      
      // Show success message
      alert('Payment processed successfully!');
      
      // Reset selection
      setSelectedPayment(null);
      setSelectedMethod('');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Make Payment</h1>
        <p className="text-gray-600 dark:text-gray-400">Pay your pending dues</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Pending Payments
              </h2>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.type === 'loan' ? 'Loan Payment' : 'Chit Group Payment'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reference: {payment.referenceId}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Pay Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Payment Methods
              </h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {method.type === 'bank_transfer' ? (
                          <CreditCardIcon className="h-6 w-6 text-gray-400" />
                        ) : method.type === 'upi' ? (
                          <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                        ) : (
                          <BanknotesIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {method.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Confirm Payment
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a payment method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedPayment(null);
                      setSelectedMethod('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!selectedMethod}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakePayment; 