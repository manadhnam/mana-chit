import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { Staff } from '@/types/database';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { supabase } from '@/lib/supabase';

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'attendance' | 'performance'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    joining_date: '',
    status: 'pending',
    aadhaar: null as File | null,
    pan: null as File | null,
    photo: null as File | null,
    signature: null as File | null,
  });

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // Mock data for now
      const mockStaff: Staff[] = [
        {
          id: '1',
          user_id: '1',
          department_id: '1',
          position: 'Senior Manager',
          joining_date: '2023-01-01',
          salary: 50000,
          status: 'active',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
        // Add more mock staff...
      ];
      setStaff(mockStaff);
    } catch (error) {
      toast.error('Failed to load staff data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Staff Handler
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, position, joining_date, status, aadhaar, pan, photo, signature } = formData;
    // TODO: Upload files to Supabase storage or mock
    const fileInfo = {
      aadhaar: aadhaar?.name,
      pan: pan?.name,
      photo: photo?.name,
      signature: signature?.name,
    };
    await supabase.from('audit_logs').insert({ action: 'add_staff', details: { name, position, joining_date, status, fileInfo } });
    // TODO: Insert staff into DB (mock for now)
    setStaff(prev => [
      { id: Date.now().toString(), user_id: name, department_id: '', position, joining_date, salary: 0, status: (['active','inactive','on_leave','pending'].includes(status) ? status : 'pending') as 'active' | 'inactive' | 'on_leave' | 'pending', created_at: joining_date, updated_at: joining_date },
      ...prev
    ]);
    toast.success('Staff added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', position: '', joining_date: '', status: 'pending', aadhaar: null, pan: null, photo: null, signature: null });
  };

  // Approve/Verify Handlers
  const handleVerifyStaff = async (staffId: string) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: 'active' } : s));
    await supabase.from('audit_logs').insert({ action: 'verify_staff', details: { staffId } });
    toast.success('Staff verified and activated!');
  };
  const handleApproveStaff = async (staffId: string) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: 'active' } : s));
    await supabase.from('audit_logs').insert({ action: 'approve_staff', details: { staffId } });
    toast.success('Staff approved!');
  };
  const handleDeleteStaff = async (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    await supabase.from('audit_logs').insert({ action: 'delete_staff', details: { staffId } });
    toast.success('Staff deleted!');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Audit Log Link */}
      <div className="flex justify-end mb-2">
        <a href="/department-head/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage department staff, attendance, and performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Staff
          </button>
        </div>
      </div>
      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-20">
            <Dialog.Title className="text-lg font-bold mb-4">Add Staff</Dialog.Title>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="mt-1 block w-full text-xs border rounded" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Position</label>
                <input type="text" value={formData.position} onChange={e => setFormData(f => ({ ...f, position: e.target.value }))} className="mt-1 block w-full text-xs border rounded" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Joining Date</label>
                <input type="date" value={formData.joining_date} onChange={e => setFormData(f => ({ ...f, joining_date: e.target.value }))} className="mt-1 block w-full text-xs border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Aadhaar</label>
                  <input type="file" accept="image/*,.pdf" onChange={e => setFormData(f => ({ ...f, aadhaar: e.target.files?.[0] || null }))} className="mt-1 block w-full text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">PAN</label>
                  <input type="file" accept="image/*,.pdf" onChange={e => setFormData(f => ({ ...f, pan: e.target.files?.[0] || null }))} className="mt-1 block w-full text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Photo</label>
                  <input type="file" accept="image/*" onChange={e => setFormData(f => ({ ...f, photo: e.target.files?.[0] || null }))} className="mt-1 block w-full text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Signature</label>
                  <input type="file" accept="image/*" onChange={e => setFormData(f => ({ ...f, signature: e.target.files?.[0] || null }))} className="mt-1 block w-full text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1 bg-gray-200 rounded text-xs">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-primary-600 text-white rounded text-xs">Add</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`${
              activeTab === 'list'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Staff List
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`${
              activeTab === 'attendance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`${
              activeTab === 'performance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Performance
          </button>
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {activeTab === 'list' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {staff.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <UserGroupIcon className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.user_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{member.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : member.status === 'on_leave'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(member.joining_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4">
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteStaff(member.id)}>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {member.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleVerifyStaff(member.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Verify</button>
                            <button onClick={() => handleApproveStaff(member.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Approve</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance Overview</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Export
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                    Mark Attendance
                  </button>
                </div>
              </div>
              {/* Add attendance calendar and list here */}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Performance Reviews</h3>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                  New Review
                </button>
              </div>
              {/* Add performance metrics and reviews here */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffManagement; 