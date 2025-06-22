import React, { useState } from 'react';
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
    commission_percentage: '',
    start_date: '',
    description: ''
  });

  const branchId = user?.branchId;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                required
                value={formData.group_name}
                onChange={(e) => setFormData({...formData, group_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="Enter group name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chit Value (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.chit_value}
                onChange={(e) => setFormData({...formData, chit_value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="Enter chit value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Members *
              </label>
              <input
                type="number"
                required
                value={formData.max_members}
                onChange={(e) => setFormData({...formData, max_members: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="Enter member count"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Months) *
              </label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="Enter duration"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission (%) *
              </label>
              <input
                type="number"
                required
                value={formData.commission_percentage}
                onChange={(e) => setFormData({...formData, commission_percentage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="Enter commission rate"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="Enter group description"
            />
          </div>

          <div className="flex justify-end space-x-4">
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