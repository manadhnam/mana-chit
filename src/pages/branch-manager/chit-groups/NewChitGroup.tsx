import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const NewChitGroup = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    group_name: '',
    chit_value: '',
    max_members: '',
    duration: '',
    commission_percentage: '5', // Default commission
    start_date: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      // Automatically set duration to match number of members
      if (name === 'max_members') {
        newFormData.duration = value;
      }
      return newFormData;
    });
  };

  const calculatedValues = useMemo(() => {
    const chitValue = parseFloat(formData.chit_value) || 0;
    const maxMembers = parseInt(formData.max_members, 10) || 0;
    const commissionPercentage = parseFloat(formData.commission_percentage) || 0;

    if (chitValue <= 0 || maxMembers <= 0) {
      return { installment: 0, totalCommission: 0, monthlyCollection: 0 };
    }

    const installment = chitValue / maxMembers;
    const totalCommission = (chitValue * commissionPercentage) / 100;
    const monthlyCollection = installment * maxMembers;

    return {
      installment,
      totalCommission,
      monthlyCollection,
    };
  }, [formData.chit_value, formData.max_members, formData.commission_percentage]);

  const branchId = user?.branch_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId) {
      toast.error('Could not determine your branch. Please re-login.');
      return;
    }
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('chit_groups').insert({
        group_name: formData.group_name,
        chit_value: Number(formData.chit_value),
        max_members: Number(formData.max_members),
        duration: Number(formData.duration),
        commission_percentage: Number(formData.commission_percentage),
        start_date: formData.start_date,
        description: formData.description,
        branch_id: branchId,
        status: 'pending',
        current_cycle: 0,
      });

      if (error) throw error;

      toast.success('Chit group created successfully and is pending approval.');
      navigate('/branch-manager/groups');
    } catch (error: any) {
      toast.error('Failed to create chit group: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!branchId) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error: Branch Information Missing</AlertTitle>
          <AlertDescription>
            Could not create a new group because your branch information is missing. Please re-login or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/branch-manager/groups')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Group List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Chit Group</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="md:col-span-2">
              <label htmlFor="group_name" className="block text-sm font-medium text-gray-700">Group Name *</label>
              <input type="text" name="group_name" id="group_name" required value={formData.group_name} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., Summer Savings Group"/>
            </div>

            <div>
              <label htmlFor="chit_value" className="block text-sm font-medium text-gray-700">Chit Value (₹) *</label>
              <input type="number" name="chit_value" id="chit_value" required value={formData.chit_value} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., 50000"/>
            </div>

            <div>
              <label htmlFor="max_members" className="block text-sm font-medium text-gray-700">Number of Members *</label>
              <input type="number" name="max_members" id="max_members" required value={formData.max_members} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., 10"/>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (Months)</label>
              <input type="number" name="duration" id="duration" readOnly value={formData.duration} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" placeholder="Same as member count"/>
            </div>

            <div>
              <label htmlFor="commission_percentage" className="block text-sm font-medium text-gray-700">Commission (%) *</label>
              <input type="number" name="commission_percentage" id="commission_percentage" required value={formData.commission_percentage} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., 5" step="0.1"/>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input type="date" name="start_date" id="start_date" required value={formData.start_date} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"/>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Calculated Details</h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1 bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Monthly Installment</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">₹{calculatedValues.installment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
              </div>
              <div className="sm:col-span-1 bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Total Commission</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">₹{calculatedValues.totalCommission.toLocaleString('en-IN')}</dd>
              </div>
              <div className="sm:col-span-2 bg-blue-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-blue-600">Total Collection per Month</dt>
                <dd className="mt-1 text-2xl font-bold text-blue-800">₹{calculatedValues.monthlyCollection.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="Optional notes about the group"/>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/branch-manager/groups')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Chit Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChitGroup; 