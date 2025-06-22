import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const customerSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  branch_id: z.string().uuid('A branch must be selected'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Branch {
  id: string;
  name: string;
}

interface AddNewCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

const AddNewCustomer: React.FC<AddNewCustomerProps> = ({ isOpen, onClose, onCustomerAdded }) => {
  const { user } = useAuthStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    const fetchBranches = async () => {
      // In a real app, you'd fetch branches associated with the department head.
      const { data, error } = await supabase.from('branches').select('id, name').eq('status', 'active');
      if (error) {
        toast.error('Failed to load branches.');
      } else {
        setBranches(data);
      }
    };
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

  const onSubmit = async (data: CustomerFormData) => {
    setLoading(true);
    try {
      // Create a customer 'code' before insertion
      const customerCode = `CUST-${String(Date.now()).slice(-6)}`;

      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert([{ ...data, code: customerCode, status: 'pending' }])
        .select()
        .single();
        
      if (error) throw error;

      toast.success('New customer has been submitted for approval.');
      onCustomerAdded();
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add customer.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter the details of the new customer. They will be in a "pending approval" state.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCustomer; 