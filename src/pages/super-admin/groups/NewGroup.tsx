import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { log_audit } from '@/lib/audit';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@/components/ui/textarea';

const groupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  branch_id: z.string().uuid('A branch must be selected'),
  chit_value: z.number().positive('Chit value must be a positive number'),
  member_limit: z.number().int().min(2, 'Group must have at least 2 members'),
  start_date: z.string().nonempty('Start date is required'),
  frequency: z.enum(['monthly', 'weekly']),
  description: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface Branch {
  id: string;
  name: string;
}

const NewGroup = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      frequency: 'monthly',
    }
  });

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('branches').select('id, name').eq('status', 'active');
      if (error) {
        toast.error('Failed to load branches.');
      } else {
        setBranches(data);
      }
      setLoading(false);
    };
    fetchBranches();
  }, []);

  const onSubmit = async (data: GroupFormData) => {
    setLoading(true);
    try {
      const { data: newGroup, error } = await supabase
        .from('chit_groups')
        .insert([{ ...data, status: 'pending' }])
        .select()
        .single();
        
      if (error) throw error;

      toast.success('Group created successfully!');
      await log_audit('super_admin.group.create', {
        group_id: newGroup.id,
        group_name: newGroup.name,
      });
      navigate(`/super-admin/groups/${newGroup.id}`);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/super-admin/groups')} className="pl-0">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Group List
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Chit Group</CardTitle>
          <CardDescription>Define the details for the new chit group.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch_id">Branch</Label>
              <Controller
                name="branch_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.branch_id && <p className="text-sm text-red-500">{errors.branch_id.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="chit_value">Chit Value (₹)</Label>
                <Input id="chit_value" type="number" {...register('chit_value', { valueAsNumber: true })} />
                {errors.chit_value && <p className="text-sm text-red-500">{errors.chit_value.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="member_limit">Member Limit</Label>
                <Input id="member_limit" type="number" {...register('member_limit', { valueAsNumber: true })} />
                {errors.member_limit && <p className="text-sm text-red-500">{errors.member_limit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="frequency">Payment Frequency</Label>
                 <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Group...' : 'Create Group'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewGroup; 