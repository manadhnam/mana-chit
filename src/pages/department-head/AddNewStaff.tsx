import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';



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
  const [formData, setFormData] = useState<NewStaffMember>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData(initialFormData);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
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
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>
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

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Adding Staff...' : 'Add Staff Member'}
            </button>
            {success && (
              <span className="text-green-600 font-medium">
                Staff member added successfully!
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewStaff; 