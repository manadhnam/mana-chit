import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

interface PaymentReceiptProps {
  payment: {
    id: string;
    type: 'chit' | 'loan';
    amount: number;
    date: string;
    description: string;
    collectedBy: string;
    receiptNumber: string;
  };
  onClose: () => void;
}

const PaymentReceipt = ({ payment, onClose }: PaymentReceiptProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .receipt-details {
                margin-bottom: 30px;
              }
              .receipt-details div {
                margin-bottom: 10px;
              }
              .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Mana Chit</h1>
              <h2>Payment Receipt</h2>
            </div>
            <div class="receipt-details">
              <div><strong>Receipt No:</strong> ${payment.receiptNumber}</div>
              <div><strong>Date:</strong> ${format(new Date(payment.date), 'dd/MM/yyyy')}</div>
              <div><strong>Payment Type:</strong> ${payment.type === 'chit' ? 'Chit Contribution' : 'Loan Payment'}</div>
              <div><strong>Amount:</strong> ₹${payment.amount.toLocaleString()}</div>
              <div><strong>Description:</strong> ${payment.description}</div>
              <div><strong>Collected By:</strong> ${payment.collectedBy}</div>
            </div>
            <div class="footer">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p>Thank you for your business!</p>
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print Receipt</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Payment Receipt
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Receipt No:</span>
              <span className="font-medium text-gray-900 dark:text-white">{payment.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {format(new Date(payment.date), 'dd/MM/yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{payment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Description:</span>
              <span className="font-medium text-gray-900 dark:text-white text-right">{payment.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Collected By:</span>
              <span className="font-medium text-gray-900 dark:text-white">{payment.collectedBy}</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center"
            >
              {isPrinting ? (
                <span>Printing...</span>
              ) : (
                <>
                  Print Receipt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt; 