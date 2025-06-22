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

const customerSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  address: z.string().optional(),
  branch_id: z.string().uuid('A branch must be selected'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Branch {
  id: string;
  name: string;
}

const NewCustomer = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('branches').select('id, name').eq('status', 'active');
      if (error) {
        toast.error('Failed to load branches.');
        console.error('Error fetching branches:', error);
      } else {
        setBranches(data);
      }
      setLoading(false);
    };
    fetchBranches();
  }, []);

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert([{ ...data, status: 'active' }])
        .select()
        .single();
        
      if (error) throw error;

      toast.success('Customer created successfully!');
      await log_audit('super_admin.customer.create', {
        customer_id: newCustomer.id,
        customer_name: newCustomer.name,
      });
      navigate(`/super-admin/customers/${newCustomer.id}`);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create customer.');
      console.error('Error creating customer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/super-admin/customers')} className="pl-0">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Customer List
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Customer</CardTitle>
          <CardDescription>Fill in the details below to add a new customer.</CardDescription>
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
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Customer...' : 'Create Customer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCustomer; 