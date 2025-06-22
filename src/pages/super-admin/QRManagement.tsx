import React, { useEffect, useState } from 'react';
// Removed all imports from '@/api/qrs'
import { toast } from 'react-hot-toast';

// Define QRCode type locally if needed
interface QRCode {
  id: string;
  code: string;
  status: string;
  assignedTo: string;
  date: string;
}

const QRManagement = () => {
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ assignedTo: '', status: 'Active' });

  // Mock data for development
  const mockQRCodes: QRCode[] = [
    {
      id: '1',
      code: 'QR001',
      status: 'Active',
      assignedTo: 'Branch Manager - North',
      date: '2024-01-15'
    },
    {
      id: '2',
      code: 'QR002',
      status: 'Active',
      assignedTo: 'Agent - John Doe',
      date: '2024-01-16'
    },
    {
      id: '3',
      code: 'QR003',
      status: 'Inactive',
      assignedTo: 'Branch Manager - South',
      date: '2024-01-14'
    }
  ];

  useEffect(() => {
    const fetchQRs = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch the QR codes from the database
        // For this mock, we'll just use the mock data
        setQrs(mockQRCodes);
      } catch (err) {
        console.warn('API for QR codes not available, using mock data:', err);
        setError('Could not connect to the server. Displaying mock data.');
        setQrs(mockQRCodes);
      } finally {
        setLoading(false);
      }
    };
    fetchQRs();
  }, []);

  const handleGenerate = async () => {
    if (!form.assignedTo.trim()) {
      toast.error('Please enter assignment details');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would generate the QR code and add it to the database
      // For this mock, we'll just add a new QR code to the existing list
      const newQR: QRCode = {
        id: Date.now().toString(),
        code: `QR${String(qrs.length + 1).padStart(3, '0')}`,
        status: form.status,
        assignedTo: form.assignedTo,
        date: new Date().toISOString().split('T')[0]
      };
      setQrs([newQR, ...qrs]);
      setForm({ assignedTo: '', status: 'Active' });
      toast.success('QR Code generated successfully');
    } catch (err) {
      console.warn('API not available, using mock generation:', err);
      const newQR: QRCode = {
        id: Date.now().toString(),
        code: `QR${String(qrs.length + 1).padStart(3, '0')}`,
        status: form.status,
        assignedTo: form.assignedTo,
        date: new Date().toISOString().split('T')[0]
      };
      setQrs([newQR, ...qrs]);
      setForm({ assignedTo: '', status: 'Active' });
      toast.success('QR Code generated successfully (mock)');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    toast.success('Simulating QR code download...');
    try {
      // In a real app, you would fetch the QR code image
      // For this mock, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Simulated download for QR ID: ${id}`);
      // The old logic is commented out as it will fail without a backend
      /*
      const res = await downloadQRCode(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr_${id}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('QR Code downloaded successfully');
      */
    } catch (err) {
      console.warn('Download API not available:', err);
      toast.error('Download feature is not available in development mode.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Loading QR codes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Management</h1>
        <p className="text-gray-600">Generate and manage QR codes for branch and agent assignments</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Generate & Assign QR</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Assign To (User/Role)"
            value={form.assignedTo}
            onChange={e => setForm({ ...form, assignedTo: e.target.value })}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleGenerate}
          >
            Generate QR
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">QR Codes ({qrs.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qrs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No QR codes found. Generate your first QR code above.
                  </td>
                </tr>
              ) : (
                qrs.map((qr) => (
                  <tr key={qr.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{qr.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        qr.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {qr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qr.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qr.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => handleDownload(qr.id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QRManagement; 