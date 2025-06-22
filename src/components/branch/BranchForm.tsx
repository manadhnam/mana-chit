import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Branch, User } from '@/types/database';

const branchSchema = z.object({
  name: z.string().min(3, 'Branch name must be at least 3 characters'),
  code: z.string().min(2, 'Branch code must be at least 2 characters'),
  address: z.string().min(10, 'Address is required'),
  phone: z.string().min(10, 'A valid phone number is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['active', 'inactive']),
  manager_id: z.string().uuid('A manager must be selected').optional(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface BranchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => void;
  branch?: Branch | null;
  isLoading: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({ isOpen, onClose, onSubmit, branch, isLoading }) => {
  const [managers, setManagers] = useState<User[]>([]);
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      manager_id: undefined,
    }
  });

  useEffect(() => {
    // Fetch users who can be managers
    const fetchManagers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('role', ['branchManager']); // Or any other role that can be a manager
      if (data) setManagers(data);
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        status: branch.status,
        manager_id: branch.manager_id,
      });
    } else {
      reset({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        status: 'active',
        manager_id: undefined,
      });
    }
  }, [branch, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{branch ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
          <DialogDescription>
            {branch ? 'Update the details of the existing branch.' : 'Fill in the details to create a new branch.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Branch Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <Label htmlFor="code">Branch Code</Label>
                <Input id="code" {...register('code')} />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
             </div>
             <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
           <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
            </div>
          <div>
            <Label htmlFor="manager_id">Branch Manager</Label>
             <Controller
                name="manager_id"
                control={control}
                render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                    {managers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                )}
            />
            {errors.manager_id && <p className="text-red-500 text-xs mt-1">{errors.manager_id.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Branch'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchForm; 