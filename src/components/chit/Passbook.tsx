import React, { useEffect, useState } from 'react';
import { getUserPassbook, generateReceipt } from '@/services/chitFundApi';

interface PassbookEntry {
  date: string;
  amount: number;
  fine: number;
  receiptUrl: string;
  id?: string;
}

interface PassbookProps {
  userId: string;
}

export const Passbook: React.FC<PassbookProps> = ({ userId }) => {
  const [passbook, setPassbook] = useState<PassbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState<string | null>(null); // paymentId
  const [genError, setGenError] = useState<string | null>(null);
  const [genUrl, setGenUrl] = useState<{ [paymentId: string]: string }>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getUserPassbook(userId).then(res => {
      if (!mounted) return;
      if (res.error) {
        setError(res.error);
      } else {
        setPassbook(res.passbook);
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [userId]);

  const handleGenerateReceipt = async (paymentId: string) => {
    setGenLoading(paymentId);
    setGenError(null);
    setGenUrl((prev) => ({ ...prev, [paymentId]: '' }));
    const res = await generateReceipt(paymentId, userId);
    setGenLoading(null);
    if (res.error) {
      setGenError(res.error);
    } else {
      setGenUrl((prev) => ({ ...prev, [paymentId]: res.receiptUrl }));
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-2">Passbook</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Fine</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {passbook.length === 0 ? (
            <tr><td colSpan={4}>No payments found.</td></tr>
          ) : passbook.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.date}</td>
              <td>₹{entry.amount}</td>
              <td>{entry.fine > 0 ? `₹${entry.fine}` : '-'}</td>
              <td>
                {entry.receiptUrl && entry.receiptUrl !== '#' ? (
                  <a href={entry.receiptUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Download</a>
                ) : genUrl[entry.id || ''] ? (
                  <a href={genUrl[entry.id || '']} className="text-green-600 underline" target="_blank" rel="noopener noreferrer">Download</a>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleGenerateReceipt(entry.id || '')}
                    disabled={genLoading === entry.id}
                  >
                    {genLoading === entry.id ? 'Generating...' : 'Generate Receipt'}
                  </button>
                )}
                {genError && genLoading === entry.id && <div className="text-red-600 text-xs">{genError}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 