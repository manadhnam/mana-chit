import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ChitGroup, GroupPlan } from '@/types/chit';
import { chitService } from '@/services/chitService';

interface ChitGroupFormProps {
  branchId: string;
  onSuccess?: () => void;
}

const GROUP_PLANS: GroupPlan[] = [1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000];

export const ChitGroupForm: React.FC<ChitGroupFormProps> = ({ branchId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    plan: GROUP_PLANS[0],
    startDate: '',
    endDate: '',
    agreement: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, agreement: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('plan', String(formData.plan));
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      if (formData.agreement) {
        formDataToSend.append('agreement', formData.agreement);
      }

      // Audit log: create group
      await fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_group',
          details: {
            name: formData.name,
            plan: formData.plan,
            startDate: formData.startDate,
            endDate: formData.endDate,
            agreement: formData.agreement?.name,
          },
        }),
      });

      await chitService.createGroup({
        name: formData.name,
        plan: formData.plan,
        startDate: formData.startDate,
        endDate: formData.endDate,
        agreement: formData.agreement,
        status: 'pending',
        members: [],
        branchId,
        createdBy: 'current-user-id', // TODO: Get from auth store
      } as any);

      setFormData({
        name: '',
        plan: GROUP_PLANS[0],
        startDate: '',
        endDate: '',
        agreement: null,
      });

      toast.success('Chit group created successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create chit group:', error);
      toast.error('Failed to create chit group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Group Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Group Plan
        </label>
        <select
          id="plan"
          value={formData.plan}
          onChange={(e) => setFormData({ ...formData, plan: Number(e.target.value) as GroupPlan })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          required
        >
          {GROUP_PLANS.map((plan) => (
            <option key={plan} value={plan}>
              ₹{plan.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="agreement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Group Agreement
        </label>
        <input
          type="file"
          id="agreement"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            dark:file:bg-primary-900/50 dark:file:text-primary-300"
          accept=".pdf,.doc,.docx"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Upload the group agreement document (PDF, DOC, DOCX).
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Group'}
        </button>
      </div>
    </motion.form>
  );
}; 