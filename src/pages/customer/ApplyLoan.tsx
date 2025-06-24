import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CreditCardIcon, CalendarIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

interface LoanApplication {
  chitGroupId: string;
  amount: number;
  purpose: string;
  duration: number;
  monthlyIncome: number;
  employmentType: 'salaried' | 'self_employed' | 'business';
  documents: File[];
}

interface ChitGroup {
  id: string;
  name: string;
  chit_value: number;
}

const LoanApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [availableChitGroups, setAvailableChitGroups] = useState<ChitGroup[]>([]);
  const [formData, setFormData] = useState<LoanApplication>({
    chitGroupId: '',
    amount: 0,
    purpose: '',
    duration: 12,
    monthlyIncome: 0,
    employmentType: 'salaried',
    documents: [],
  });

  useEffect(() => {
    const fetchChitGroups = async () => {
      if (!user) return;
      try {
        // Step 1: Get the IDs of the chit groups the customer is in
        const { data: memberData, error: memberError } = await supabase
          .from('chit_group_members')
          .select('chit_group_id')
          .eq('customer_id', user.id);

        if (memberError) throw memberError;

        const groupIds = memberData.map(m => m.chit_group_id);

        if (groupIds.length === 0) {
          setAvailableChitGroups([]);
          return;
        }

        // Step 2: Fetch the details of those chit groups
        const { data: groupData, error: groupError } = await supabase
          .from('chit_groups')
          .select('id, name, chit_value')
          .in('id', groupIds);

        if (groupError) throw groupError;

        setAvailableChitGroups(groupData || []);
      } catch (error) {
        toast.error("Could not load your chit groups.");
      }
    };
    fetchChitGroups();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.branch_id) {
      toast.error('Could not verify user information. Please re-login.');
      return;
    }
    setIsLoading(true);

    try {
      // TODO: Handle document uploads to Supabase storage
      
      const { data, error } = await supabase.from('loans').insert({
        customer_id: user.id,
        branch_id: user.branch_id,
        chit_group_id: formData.chitGroupId,
        amount: formData.amount,
        purpose: formData.purpose,
        duration_months: formData.duration,
        monthly_income: formData.monthlyIncome,
        employment_type: formData.employmentType,
        status: 'pending_approval',
      }).select().single();

      if (error) throw error;

      toast.success('Loan application submitted successfully!');
      navigate('/customer/loans');
    } catch (error: any) {
      toast.error('Failed to submit loan application: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Apply for a Loan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill in the details to apply for a loan against your chit group
        </p>
      </div>

      {/* Application Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Chit Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Chit Group
            </label>
            <select
              name="chitGroupId"
              value={formData.chitGroupId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a chit group</option>
              {availableChitGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} (Value: ₹{group.chit_value.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter loan amount"
                required
                min="0"
              />
            </div>
          </div>

          {/* Loan Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Purpose of Loan
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the purpose of your loan"
              required
            />
          </div>

          {/* Loan Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Duration (months)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
                min="1"
                max="60"
              />
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Income (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HomeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your monthly income"
                required
                min="0"
              />
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self Employed</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Required Documents
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload ID proof, address proof, and income documents
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default LoanApplication; 