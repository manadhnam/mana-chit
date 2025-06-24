import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';

// New mock data including a 'Pending' member for development
const mockStaff = [
  { id: 's1', user_id: 'u1', name: 'Rajesh Kumar', role: 'Agent', status: 'active' },
  { id: 's2', user_id: 'u2', name: 'Priya Sharma', role: 'Agent', status: 'inactive' },
  { id: 's3', user_id: 'u3', name: 'Amit Patel', role: 'Accountant', status: 'active' },
  { id: 's4', user_id: 'u4', name: 'Sunita Reddy', role: 'Agent', status: 'pending' },
];

interface StaffMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const statusColors: { [key in StaffMember['status']]: string } = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const StatusBadge: React.FC<{ status: StaffMember['status'] }> = ({ status }) => (
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const StaffDirectory = () => {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStaff = async () => {
    if (!user?.branch_id) return;

    setLoading(true);
    // In a real app, you'd fetch staff associated with the branch manager's branch
    // For now, we continue using mock data and add a pending user.
    // const { data, error } = await supabase.from('staff').select('*').eq('branch_id', user.branch_id);
    
    // Simulating API call
    setTimeout(() => {
        // Here we'll use the enhanced mock data
        // In a real scenario, data would come from the API call above
        setStaff(mockStaff as StaffMember[]);
        setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const handleUpdateStatus = async (staffId: string, staffName: string, newStatus: 'active' | 'inactive') => {
    if (!user) return;
  
    const oldStatus = staff.find(s => s.id === staffId)?.status;

    // Optimistic UI update
    setStaff(staff.map(s => (s.id === staffId ? { ...s, status: newStatus } : s)));

    const { error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', staffId);

    if (error) {
      toast.error(`Failed to ${newStatus === 'active' ? 'approve' : 'reject'} staff.`);
      // Revert UI on failure
      setStaff(staff.map(s => (s.id === staffId ? { ...s, status: oldStatus as StaffMember['status'] } : s)));
    } else {
      toast.success(`Staff ${staffName} has been ${newStatus === 'active' ? 'approved' : 'rejected'}.`);
      const action = `staff_${newStatus === 'active' ? 'approve' : 'reject'}`;
      const details = {
        message: `Manager ${user.email} ${newStatus === 'active' ? 'approved' : 'rejected'} staff ${staffName} (ID: ${staffId}).`,
      };
      await log_audit(action, details, user.id);
      // Optionally re-fetch to confirm
      fetchStaff();
    }
  };

  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Directory</h1>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Total Staff</div>
          <div className="text-2xl font-bold">{staff.length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Active</div>
          <div className="text-2xl font-bold">{staff.filter(s => s.status === 'active').length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Inactive</div>
          <div className="text-2xl font-bold">{staff.filter(s => s.status === 'inactive').length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500 text-sm">Pending Approval</div>
          <div className="text-2xl font-bold">{staff.filter(s => s.status === 'pending').length}</div>
        </div>
      </div>
      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search staff..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/branch-manager/staff/add" className="bg-primary-600 text-white px-4 py-2 rounded">Add Staff</Link>
      </div>
      {/* Table */}
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No staff found.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.role}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-2 space-x-2">
                  {s.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(s.user_id, s.name, 'active')}
                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(s.user_id, s.name, 'inactive')}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <Link to={`/branch-manager/staff/${s.id}`} className="text-primary-600 hover:underline">View</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* TODO: Add pagination */}
    </div>
  );
};

export default StaffDirectory; 