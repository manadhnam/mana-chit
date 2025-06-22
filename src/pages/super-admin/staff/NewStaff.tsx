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
import { UserRole } from '@/store/authStore';

const staffSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  role: z.enum(['departmentHead', 'mandalHead', 'branchManager', 'agent']),
  branch_id: z.string().uuid('A branch must be selected').optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface Branch {
  id: string;
  name: string;
}

const NewStaff = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });
  
  const selectedRole = watch('role');

  useEffect(() => {
    if (selectedRole === 'branchManager' || selectedRole === 'agent') {
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
    } else {
      setBranches([]);
    }
  }, [selectedRole]);

  const onSubmit = async (data: StaffFormData) => {
    setLoading(true);
    // Ensure branch_id is null if not applicable
    if (data.role !== 'branchManager' && data.role !== 'agent') {
      data.branch_id = undefined;
    } else if (!data.branch_id) {
        toast.error('A branch must be selected for this role.');
        setLoading(false);
        return;
    }

    try {
      // Note: This assumes you have a 'staff' or 'users' table for staff members.
      // Adjust table name and columns as per your schema.
      const { data: newStaff, error } = await supabase
        .from('users') 
        .insert([{ 
          name: data.name, 
          email: data.email, 
          phone: data.phone, 
          role: data.role, 
          branch_id: data.branch_id,
          // You might need to set a default password or send an invitation email
        }])
        .select()
        .single();
        
      if (error) throw error;

      toast.success('Staff member created successfully!');
      await log_audit('super_admin.staff.create', {
        staff_id: newStaff.id,
        staff_name: newStaff.name,
      });
      navigate(`/super-admin/staff/${newStaff.id}`);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create staff member.');
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole, label: string }[] = [
    { value: 'departmentHead', label: 'Department Head' },
    { value: 'mandalHead', label: 'Mandal Head' },
    { value: 'branchManager', label: 'Branch Manager' },
    { value: 'agent', label: 'Agent' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/super-admin/staff')} className="pl-0">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Staff Directory
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Staff Member</CardTitle>
          <CardDescription>Fill in the details for the new staff member.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>

            {(selectedRole === 'branchManager' || selectedRole === 'agent') && (
              <div className="space-y-2">
                <Label htmlFor="branch_id">Branch</Label>
                <Controller
                  name="branch_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || branches.length === 0}>
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
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Staff...' : 'Create Staff Member'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStaff; 