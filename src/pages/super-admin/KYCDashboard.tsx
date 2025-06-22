import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const mockKycData = [
  { id: 1, name: 'John Doe', submittedAt: '2024-06-01', status: 'Pending', doc: 'Aadhaar.pdf' },
  { id: 2, name: 'Jane Smith', submittedAt: '2024-06-02', status: 'Approved', doc: 'PAN.jpg' },
  { id: 3, name: 'Alice Johnson', submittedAt: '2024-06-03', status: 'Rejected', doc: 'Passport.pdf' },
];

const KYCDashboard = () => {
  const [selected, setSelected] = useState<typeof mockKycData[0] | null>(null);
  const [data, setData] = useState(mockKycData);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const { data, error } = await supabase.from('users').select('id, name, kyc_status, kyc_documents, updated_at').not('kyc_status', 'eq', 'verified');
        if (error) throw error;
        setData(data.map((u: any) => ({
          id: u.id,
          name: u.name,
          submittedAt: u.updated_at,
          status: u.kyc_status.charAt(0).toUpperCase() + u.kyc_status.slice(1),
          doc: u.kyc_documents?.kyc_url || '',
        })));
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch KYC data.');
      }
    };
    fetchKyc();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase.from('users').update({ kyc_status: 'verified' }).eq('id', id);
      if (error) throw error;
      toast.success('KYC approved!');
      setData(d => d.map(row => row.id === id ? { ...row, status: 'Approved' } : row));
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve KYC.');
    }
  };
  const handleReject = async (id: number) => {
    try {
      const { error } = await supabase.from('users').update({ kyc_status: 'rejected' }).eq('id', id);
      if (error) throw error;
      toast.success('KYC rejected!');
      setData(d => d.map(row => row.id === id ? { ...row, status: 'Rejected' } : row));
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject KYC.');
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">KYC Dashboard</h1>
      <table className="min-w-full bg-white dark:bg-gray-800 border rounded mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Submitted At</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="text-center">
              <td className="px-4 py-2 border-b">{row.name}</td>
              <td className="px-4 py-2 border-b">{row.submittedAt}</td>
              <td className={`px-4 py-2 border-b font-semibold ${row.status === 'Approved' ? 'text-green-600' : row.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{row.status}</td>
              <td className="px-4 py-2 border-b">
                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={() => setSelected(row)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">KYC Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {selected.name}</div>
            <div className="mb-2"><span className="font-semibold">Submitted At:</span> {selected.submittedAt}</div>
            <div className="mb-2"><span className="font-semibold">Document:</span> {selected.doc}</div>
            <div className="mb-4"><span className="font-semibold">Status:</span> {selected.status}</div>
            <div className="flex gap-2">
              {selected.status === 'Pending' && (
                <>
                  <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => handleApprove(selected.id)}>Approve</button>
                  <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleReject(selected.id)}>Reject</button>
                </>
              )}
              <button className="bg-gray-400 text-white px-4 py-1 rounded" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCDashboard; 