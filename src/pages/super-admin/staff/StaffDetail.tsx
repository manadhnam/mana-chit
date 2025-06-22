import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Staff } from '@/types/database';

const StaffDetail = () => {
  const { staffId } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', staffId)
        .single();
      if (error) {
        setError('Staff not found');
        setStaff(null);
      } else {
        setStaff(data);
      }
      setLoading(false);
    };
    if (staffId) fetchStaff();
  }, [staffId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!staff) return <div className="p-8 text-center text-gray-500">No staff data.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link to="/super-admin/staff" className="text-primary-600 hover:underline">&larr; Back to Staff Directory</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Staff Detail</h1>
      {/* Summary card */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">ID: {staff.id}</div>
            <div className="text-gray-500">Position: {staff.position}</div>
            <div className="text-sm text-gray-400">Status: {staff.status}</div>
            <div className="text-sm text-gray-400">Department: {staff.department_id}</div>
            <div className="text-sm text-gray-400">Joining Date: {staff.joining_date}</div>
            <div className="text-sm text-gray-400">Salary: ₹{staff.salary}</div>
            <div className="text-sm text-gray-400">Reporting To: {staff.reporting_to || '-'}</div>
          </div>
        </div>
      </div>
      {/* TODO: Add recent activity, more staff info, and API integration for related data */}
    </div>
  );
};

export default StaffDetail; 