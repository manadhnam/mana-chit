import React, { useState } from 'react';
import { sendWhatsAppMessage } from '@/services/chitFundApi';
import { toast } from 'react-hot-toast';

const mockBotData = [
  { user: 'John Doe', phone: '+91-9876543210', lastMessage: 'Welcome to Mana Chit!', status: 'Delivered' },
  { user: 'Jane Smith', phone: '+91-9123456780', lastMessage: 'Your KYC is pending.', status: 'Failed' },
  { user: 'Alice Johnson', phone: '+91-9988776655', lastMessage: 'Payment received.', status: 'Delivered' },
  { user: 'Bob Brown', phone: '+91-9001122334', lastMessage: 'Reminder: Next chit date.', status: 'Delivered' },
  { user: 'Charlie Green', phone: '+91-9112233445', lastMessage: 'Unable to process request.', status: 'Failed' },
];

const WhatsAppBot = () => {
  const total = mockBotData.length;
  const delivered = mockBotData.filter((d) => d.status === 'Delivered').length;
  const failed = mockBotData.filter((d) => d.status === 'Failed').length;
  const [sendingIdx, setSendingIdx] = useState<number | null>(null);

  // Resend handler
  const handleResend = async (row: typeof mockBotData[0], idx: number) => {
    setSendingIdx(idx);
    try {
      const res = await sendWhatsAppMessage({
        recipientPhone: row.phone,
        message: row.lastMessage,
        templateName: undefined,
      });
      if (res.success) {
        toast.success('Message resent successfully');
      } else {
        toast.error(res.error || 'Failed to resend message');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend message');
    } finally {
      setSendingIdx(null);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">WhatsApp Bot</h1>
      <div className="flex gap-6 mb-6">
        <div className="bg-green-100 dark:bg-green-900 rounded p-4 flex-1 text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{total}</div>
          <div className="text-gray-700 dark:text-gray-200">Total Users</div>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 flex-1 text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{delivered}</div>
          <div className="text-gray-700 dark:text-gray-200">Delivered</div>
        </div>
        <div className="bg-red-100 dark:bg-red-900 rounded p-4 flex-1 text-center">
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{failed}</div>
          <div className="text-gray-700 dark:text-gray-200">Failed</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Recent Bot Interactions</h2>
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">User</th>
              <th className="px-4 py-2 border-b">Phone Number</th>
              <th className="px-4 py-2 border-b">Last Message</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockBotData.map((row, idx) => (
              <tr key={idx} className="text-center">
                <td className="px-4 py-2 border-b">{row.user}</td>
                <td className="px-4 py-2 border-b">{row.phone}</td>
                <td className="px-4 py-2 border-b">{row.lastMessage}</td>
                <td className={`px-4 py-2 border-b font-semibold ${row.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>{row.status}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={sendingIdx === idx}
                    onClick={() => handleResend(row, idx)}
                  >
                    {sendingIdx === idx ? 'Sending...' : 'Resend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhatsAppBot; 