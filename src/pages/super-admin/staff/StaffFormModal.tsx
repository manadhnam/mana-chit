import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '@/types/database';

const staffSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  mobile: z.string().min(10, 'A valid 10-digit phone number is required'),
  role: z.enum(['branchManager', 'agent', 'departmentHead', 'mandalHead']),
  position: z.string().min(3, 'Position is required'),
  department_id: z.string().uuid('Department is required'),
  branch_id: z.string().uuid('Branch is required').optional(),
  joining_date: z.string().nonempty('Joining date is required'),
  salary: z.number().positive('Salary must be a positive number'),
  status: z.enum(['active', 'inactive', 'on_leave', 'pending']),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffToEdit?: Staff | null;
  departments: { id: string, name: string }[];
  branches: { id: string, name: string }[];
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, onSuccess, staffToEdit, departments, branches }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset, watch } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      status: 'pending',
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (staffToEdit) {
      // Edit logic not fully implemented as it's complex
      // For now, form is primarily for creation
      reset({
        status: 'pending',
        role: 'agent',
      });
    } else {
      reset({ status: 'pending', role: 'agent' });
    }
  }, [staffToEdit, reset]);

  const onSubmit = async (formData: StaffFormData) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.functions.invoke('create-staff', {
        body: { staffData: formData },
      });

      if (error) throw new Error(`Function error: ${error.message}`);
      if (data.error) throw new Error(`Creation failed: ${data.error}`);

      toast.success(`Staff member ${formData.name} created successfully.`);
      onSuccess();
      handleClose();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{staffToEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogDescription>
            This will create a new user with login credentials and a corresponding staff profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input {...register('name')} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" {...register('email')} /></div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Password</Label><Input type="password" {...register('password')} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input {...register('mobile')} /></div>
          </div>
           <div className="space-y-2"><Label>Role</Label><Controller name="role" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branchManager">Branch Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="mandalHead">Mandal Head</SelectItem>
                    <SelectItem value="departmentHead">Department Head</SelectItem>
                  </SelectContent>
                </Select>
            )}/></div>
          {(selectedRole === 'branchManager' || selectedRole === 'agent') && (
            <div className="space-y-2"><Label>Branch</Label><Controller name="branch_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Assign a branch"/></SelectTrigger>
                <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            )}/></div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Position / Title</Label><Input {...register('position')} /></div>
            <div className="space-y-2"><Label>Department</Label><Controller name="department_id" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Assign a department"/></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
            )}/></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Salary</Label><Input type="number" {...register('salary', { valueAsNumber: true })} /></div>
            <div className="space-y-2"><Label>Joining Date</Label><Input type="date" {...register('joining_date')} /></div>
            <div className="space-y-2"><Label>Status</Label><Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
            )}/></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Staff Member'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffFormModal; 