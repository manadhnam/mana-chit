import React, { useState } from 'react';
import { uploadBranchQrCode } from '@/services/chitFundApi';

interface BranchQrUploadProps {
  branchId: string;
}

export const BranchQrUpload: React.FC<BranchQrUploadProps> = ({ branchId }) => {
  const [upiId, setUpiId] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!upiId || !qrFile) {
      setError('UPI ID and QR image are required.');
      setLoading(false);
      return;
    }
    const res = await uploadBranchQrCode(branchId, upiId, qrFile);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setUpiId('');
      setQrFile(null);
    } else {
      setError(res.error || 'Failed to upload QR code');
    }
  };

  return (
    <form className="bg-white rounded-lg shadow p-4 space-y-4 max-w-md" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Upload Branch QR Code</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">QR code uploaded successfully!</div>}
      <div>
        <label className="block mb-1 font-medium">UPI ID</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">QR Code Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload QR Code'}
      </button>
    </form>
  );
}; 