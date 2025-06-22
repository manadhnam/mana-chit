import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChitGroup, Branch } from '@/types/database';

const groupSchema = z.object({
  group_name: z.string().min(3, 'Group name is required'),
  chit_value: z.number().positive('Chit value must be a positive number'),
  max_members: z.number().int().min(2, 'Must have at least 2 members'),
  branch_id: z.string().uuid('A branch is required'),
  status: z.enum(['pending', 'active', 'completed', 'closed', 'cancelled']),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupToEdit?: ChitGroup | null;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({ isOpen, onClose, onSuccess, groupToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  const { register, handleSubmit, control, reset } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      status: 'pending',
    }
  });

  useEffect(() => {
    // Fetch branches for the select dropdown
    const fetchBranches = async () => {
      const { data, error } = await supabase.from('branches').select('*');
      if (error) {
        toast.error('Failed to fetch branches');
      } else {
        setBranches(data || []);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (groupToEdit) {
      reset(groupToEdit);
    } else {
      reset({ status: 'pending', group_name: '', chit_value: 0, max_members: 25 });
    }
  }, [groupToEdit, reset]);

  const onSubmit = async (formData: GroupFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('chit_groups').insert(formData);
      if (error) throw error;

      toast.success(`Group "${formData.group_name}" created successfully.`);
      onSuccess();
      handleClose();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create group.');
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{groupToEdit ? 'Edit Group' : 'Add New Chit Group'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input {...register('group_name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chit Value (INR)</Label>
              <Input type="number" {...register('chit_value', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Max Members</Label>
              <Input type="number" {...register('max_members', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Branch</Label>
            <Controller name="branch_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select a branch" /></SelectTrigger>
                <SelectContent>
                  {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
           <div className="space-y-2">
            <Label>Status</Label>
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Group'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFormModal; 