import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import PaymentReceipt from './PaymentReceipt';
import { toast } from 'react-hot-toast';

interface ManualPaymentCollectionProps {
  onClose: () => void;
  paymentDetails: {
    id: string;
    type: 'chit' | 'loan';
    amount: number;
    description: string;
    userId: string;
    userName: string;
  };
}

const ManualPaymentCollection = ({ onClose, paymentDetails }: ManualPaymentCollectionProps) => {
  const { user } = useAuthStore();
  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCollectPayment = async () => {
    try {
      setIsProcessing(true);
      // Here you would typically make an API call to record the payment
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a receipt number (in production, this would come from the backend)
      const receiptNumber = `RCT-${Date.now().toString().slice(-6)}`;
      
      // Show the receipt
      setShowReceipt(true);
      toast.success('Payment collected successfully!');
    } catch (error) {
      toast.error('Failed to collect payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Collect Payment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Details</h4>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-gray-500 dark:text-gray-400">User:</span>{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.userName}</span>
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentDetails.type === 'chit' ? 'Chit Contribution' : 'Loan Payment'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{paymentDetails.amount.toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Description:</span>{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.description}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCollectPayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Collect Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && (
        <PaymentReceipt
          payment={{
            id: paymentDetails.id,
            type: paymentDetails.type,
            amount: paymentDetails.amount,
            date: new Date().toISOString(),
            description: paymentDetails.description,
            collectedBy: user?.name || 'Admin',
            receiptNumber: `RCT-${Date.now().toString().slice(-6)}`
          }}
          onClose={() => {
            setShowReceipt(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default ManualPaymentCollection; 