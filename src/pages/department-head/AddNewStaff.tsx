import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabaseClient';

interface NewStaffMember {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  salary: string;
  status: 'active' | 'pending';
}

const initialFormData: NewStaffMember = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  joinDate: '',
  salary: '',
  status: 'pending',
};

const AddNewStaff = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<NewStaffMember>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [department, setDepartment] = useState('');

  useEffect(() => {
    // Fetch department from Department Head's profile
    const fetchDepartment = async () => {
      if (user?.department_id) {
        const { data } = await supabase.from('departments').select('name').eq('id', user.department_id).single();
        if (data) setDepartment(data.name);
        setFormData(prev => ({ ...prev, department: user.department_id || '' }));
      }
    };
    fetchDepartment();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Save staff with department assignment
    await supabase.from('users').insert({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      mobile: formData.phone,
      role: formData.role,
      department_id: user?.department_id,
      status: formData.status,
      join_date: formData.joinDate,
      salary: formData.salary
    });
    setLoading(false);
    setSuccess(true);
    setFormData(initialFormData);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserPlusIcon className="h-8 w-8 text-blue-600" />
          Add New Staff
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                />
              </div>
            </div>
            {/* Employment Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Employment Details</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="agent">Agent</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={department}
                  disabled
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  placeholder="Enter annual salary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
          {success && <div className="mt-4 text-green-600">Staff member added successfully!</div>}
        </div>
      </form>
    </div>
  );
};

export default AddNewStaff; 