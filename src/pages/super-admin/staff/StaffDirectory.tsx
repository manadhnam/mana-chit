import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Staff, Department, Branch, User } from '@/types/database';
import { PlusIcon } from '@heroicons/react/24/solid';
import StaffFormModal from './StaffFormModal';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

// Define a more detailed type for the data we fetch
type StaffWithDetails = Staff & {
  users: User | null;
  departments: Department | null;
};

const StaffDirectory = () => {
  const [staff, setStaff] = useState<StaffWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffWithDetails | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch departments
      const { data: depts, error: deptError } = await supabase.from('departments').select('*');
      if (deptError) throw new Error('Failed to fetch departments');
      setDepartments(depts || []);

      // Fetch branches
      const { data: branchData, error: branchError } = await supabase.from('branches').select('*');
      if (branchError) throw new Error('Failed to fetch branches');
      setBranches(branchData || []);

      // Fetch staff
      let query = supabase.from('staff').select('*, users(*), departments(*)', { count: 'exact' });
      if (departmentFilter !== 'all') {
        query = query.eq('department_id', departmentFilter);
      }
      if (search) {
        query = query.ilike('users.name', `%${search}%`);
      }
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error: staffError, count } = await query.range(from, to);

      if (staffError) throw new Error('Failed to fetch staff');
      
      setStaff(data as StaffWithDetails[] || []);
      setTotal(count || 0);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, departmentFilter, search]);

  const handleSuccess = () => {
    fetchData(); // Refresh data on successful add/edit
    setIsModalOpen(false);
  };

  const handleAddNew = () => {
    setStaffToEdit(null);
    setIsModalOpen(true);
  };
  
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Directory</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage all staff members across the organization.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
         <input
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Staff Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4">{member.users?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{member.position}</td>
                  <td className="px-6 py-4">{member.departments?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{member.users?.email || 'N/A'}</td>
                  <td className="px-6 py-4">{member.status}</td>
                  <td className="px-6 py-4">
                    <Button variant="link" size="sm" onClick={() => {
                        setStaffToEdit(member);
                        setIsModalOpen(true);
                    }}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
      </div>

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        staffToEdit={staffToEdit}
        departments={departments}
        branches={branches}
      />
    </div>
  );
};

export default StaffDirectory; 