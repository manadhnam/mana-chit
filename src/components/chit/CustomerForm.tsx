import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const customerSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  mobile: z.string().min(10, 'A valid 10-digit phone number is required'),
  address: z.string().min(10, 'A valid address is required'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  branchId: string;
  onSuccess: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ branchId, onSuccess }) => {
  const { user: agentUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (formData: CustomerFormData) => {
    if (!agentUser) {
      toast.error('You must be logged in to add a customer.');
      return;
    }

    try {
      // 1. Create the user record for the customer
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          role: 'customer',
          status: 'pending_approval',
          branch_id: branchId,
        })
        .select()
        .single();
        
      if (userError) throw new Error(`Could not create user: ${userError.message}`);
      if (!newUser) throw new Error('User creation failed.');

      // 2. Create the customer profile, linking the agent
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: newUser.id,
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          address: formData.address,
          agent_id: agentUser.id, // <-- This is the crucial link
          branch_id: branchId,
          status: 'pending_approval',
          created_by: agentUser.id
        });
        
      if (customerError) {
        // Attempt to roll back user creation
        await supabase.from('users').delete().eq('id', newUser.id);
        throw new Error(`Could not create customer profile: ${customerError.message}`);
      }

      toast.success('Customer created successfully and is pending approval.');
      onSuccess();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Phone Number</Label>
          <Input id="mobile" {...register('mobile')} />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register('address')} />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>
       {/* Note: File upload inputs have been removed for this refactoring to focus on core logic */}
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </div>
    </form>
  );
}; 