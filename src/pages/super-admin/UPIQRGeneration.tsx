import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCodeIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface UPIQRCode {
  id: string;
  branchId: string;
  branchName: string;
  upiId: string;
  qrType: 'STATIC' | 'DYNAMIC';
  qrString: string;
  createdAt: string;
}

const UPIQRGeneration = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [qrCodes, setQrCodes] = useState<UPIQRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [qrType, setQrType] = useState<'STATIC' | 'DYNAMIC'>('STATIC');
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    // Mock API calls
    const fetchInitialData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBranches: Branch[] = [
        { id: 'BR001', name: 'North Branch', code: 'NB01' },
        { id: 'BR002', name: 'South Branch', code: 'SB01' },
        { id: 'BR003', name: 'East Branch', code: 'EB01' },
      ];

      const mockQRCodes: UPIQRCode[] = [
        {
          id: 'QR001',
          branchId: 'BR001',
          branchName: 'North Branch',
          upiId: 'northbranch@upi',
          qrType: 'STATIC',
          qrString: 'upi://pay?pa=northbranch@upi&pn=North%20Branch',
          createdAt: '2024-01-10T10:00:00Z',
        }
      ];

      setBranches(mockBranches);
      setQrCodes(mockQRCodes);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch || !upiId) {
      toast.error('Please select a branch and enter a UPI ID');
      return;
    }

    const branch = branches.find(b => b.id === selectedBranch);
    if (!branch) {
      toast.error('Invalid branch selected');
      return;
    }

    let qrString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(branch.name)}`;
    if (qrType === 'DYNAMIC' && amount) {
      qrString += `&am=${amount}`;
    }

    const newQRCode: UPIQRCode = {
      id: `QR${Date.now()}`,
      branchId: branch.id,
      branchName: branch.name,
      upiId,
      qrType,
      qrString,
      createdAt: new Date().toISOString(),
    };

    setQrCodes(prev => [newQRCode, ...prev]);
    toast.success('QR Code generated successfully');

    // Reset form
    setSelectedBranch('');
    setUpiId('');
    setQrType('STATIC');
    setAmount('');
  };
  
  const downloadQRCode = (id: string) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded!');
    } else {
      toast.error('Could not find QR Code to download.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading QR Management...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">UPI QR Code Generation</h1>
        <p className="text-gray-600">Create and manage static or dynamic UPI QR codes for each branch.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Generation Form */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New QR Code</h2>
            <form onSubmit={handleGenerateQR} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., branchname@bank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">QR Type</label>
                <div className="mt-2 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="qrType"
                      value="STATIC"
                      checked={qrType === 'STATIC'}
                      onChange={() => setQrType('STATIC')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Static</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="qrType"
                      value="DYNAMIC"
                      checked={qrType === 'DYNAMIC'}
                      onChange={() => setQrType('DYNAMIC')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Dynamic</span>
                  </label>
                </div>
              </div>

              {qrType === 'DYNAMIC' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (Optional for Dynamic QR)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Generate
              </button>
            </form>
          </motion.div>
        </div>

        {/* QR Code List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Existing QR Codes ({qrCodes.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qrCodes.map(qr => (
                    <tr key={qr.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{qr.branchName}</div>
                        <div className="text-sm text-gray-500">{qr.branchId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{qr.upiId}</td>
                      <td className="px-6 py-4">
                        <QRCodeCanvas id={qr.id} value={qr.qrString} size={80} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => downloadQRCode(qr.id)} className="text-blue-600 hover:text-blue-900" title="Download QR">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Edit">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Delete">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UPIQRGeneration; 