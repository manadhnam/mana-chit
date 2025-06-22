import React, { useState } from 'react';
import { manualPayment } from '@/services/chitFundApi';

interface ManualPaymentFormProps {
  agentId: string;
  groupId: string;
  onSubmit?: (data: any) => void;
}

export const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({ agentId, groupId, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [paidOn, setPaidOn] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('');
  const [mode, setMode] = useState<'cash' | 'online' | 'phonepe_qr'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await manualPayment({
      userId: agentId, // In real use, this should be the user being paid for, not the agent
      groupId,
      amount: Number(amount),
      mode,
      paidOn,
      agentId,
      screenshot: screenshot || undefined,
      remarks,
    });
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setAmount('');
      setPaidOn('');
      setScreenshot(null);
      setRemarks('');
      setMode('cash');
      if (onSubmit) onSubmit(res);
    } else {
      setError(res.error || 'Failed to submit payment');
    }
  };

  return (
    <form className="bg-white rounded-lg shadow p-4 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Manual Payment Entry</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Payment submitted successfully!</div>}
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Paid On</label>
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={paidOn}
          onChange={e => setPaidOn(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mode</label>
        <select className="border rounded px-2 py-1 w-full" value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
          <option value="phonepe_qr">PhonePe QR</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Screenshot (optional)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Remarks</label>
        <textarea
          className="border rounded px-2 py-1 w-full"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}; 