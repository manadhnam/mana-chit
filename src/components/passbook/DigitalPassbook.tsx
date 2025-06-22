import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable functionality
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Payment {
  id: string;
  created_at: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

const DigitalPassbook = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch payment history.');
    } else {
      const formattedData = data.map((p: any): Payment => ({
        id: p.id,
        created_at: new Date(p.created_at).toLocaleDateString(),
        description: p.manual ? `Manual payment by agent` : `Online payment`,
        amount: p.amount,
        type: 'credit', // Example: logic to determine type is needed
      }));
      setPayments(formattedData);
    }
    setLoading(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Description", "Amount (INR)"];
    const tableRows: any[] = [];

    payments.forEach(payment => {
      const paymentData = [
        payment.created_at,
        payment.description,
        payment.amount,
      ];
      tableRows.push(paymentData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text(`Passbook for ${user?.name}`, 14, 15);
    doc.save(`passbook_${user?.id}.pdf`);
  };

  if (loading) {
    return <div className="p-4">Loading passbook...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Digital Passbook</h2>
        <button
          onClick={generatePDF}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">No transactions found.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.created_at}</td>
                  <td className="px-6 py-4">{p.description}</td>
                  <td className="px-6 py-4 text-right text-green-600">{p.type === 'credit' ? `₹${p.amount}` : '-'}</td>
                  <td className="px-6 py-4 text-right text-red-600">{p.type === 'debit' ? `₹${p.amount}` : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DigitalPassbook;