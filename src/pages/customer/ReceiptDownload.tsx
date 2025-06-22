import React, { useEffect, useState } from 'react';
import { getReceipts, downloadReceipt, Receipt } from '@/api/receipts';

const ReceiptDownload = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getReceipts()
      .then(res => setReceipts(res.data || []))
      .catch(() => setError('Failed to load receipts'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id: string) => {
    try {
      const res = await downloadReceipt(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('Failed to download receipt');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading receipts...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Receipt Download</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chit Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap">{r.group}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{r.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleDownload(r.id)}>
                    Download
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

export default ReceiptDownload; 