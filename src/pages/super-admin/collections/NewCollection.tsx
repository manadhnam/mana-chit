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
import { Combobox } from '@/components/ui/combobox';

const collectionSchema = z.object({
  customer_id: z.string().uuid('A customer must be selected'),
  chit_group_id: z.string().uuid('A chit group must be selected'),
  amount: z.number().positive('Amount must be a positive number'),
  payment_method: z.enum(['cash', 'upi', 'card', 'bank_transfer', 'cheque']),
  payment_date: z.string().nonempty('Payment date is required'),
  reference_id: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface Customer {
  id: string;
  name: string;
}

interface ChitGroup {
  id: string;
  group_name: string;
}

const NewCollection = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [chitGroups, setChitGroups] = useState<ChitGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      payment_method: 'cash',
    }
  });

  const selectedCustomerId = watch('customer_id');

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .ilike('name', `%${customerSearch}%`)
        .limit(20);
      if (error) {
        toast.error('Failed to search for customers.');
      } else {
        setCustomers(data as Customer[]);
      }
    };
    const debounce = setTimeout(() => {
        if(customerSearch) fetchCustomers();
    }, 500);
    return () => clearTimeout(debounce);
  }, [customerSearch]);

  useEffect(() => {
    const fetchChitGroups = async () => {
      if (!selectedCustomerId) {
        setChitGroups([]);
        return;
      }
      // Fetch group memberships for the customer
      const { data: memberships, error: memberError } = await supabase
        .from('chit_group_members')
        .select('chit_group_id')
        .eq('customer_id', selectedCustomerId);

      if (memberError || !memberships) {
        toast.error("Failed to fetch customer's groups.");
        setChitGroups([]);
        return;
      }

      const groupIds = memberships.map(m => m.chit_group_id);
      
      const { data, error } = await supabase
        .from('chit_groups')
        .select('id, group_name')
        .in('id', groupIds);
      
      if (error) {
        toast.error('Failed to load chit groups for the selected customer.');
      } else {
        setChitGroups(data);
      }
    };
    fetchChitGroups();
  }, [selectedCustomerId]);

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true);
    try {
      const { data: newCollection, error } = await supabase
        .from('contributions')
        .insert([{ ...data, status: 'completed' }])
        .select()
        .single();
        
      if (error) throw error;

      toast.success('Collection recorded successfully!');
      await log_audit('super_admin.collection.create', {
        collection_id: newCollection.id,
        customer_id: newCollection.customer_id,
        amount: newCollection.amount,
      });
      navigate(`/super-admin/collections/${newCollection.id}`);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to record collection.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = ['cash', 'upi', 'card', 'bank_transfer', 'cheque'];
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/super-admin/collections')} className="pl-0">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Collection List
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Record New Collection</CardTitle>
          <CardDescription>Manually enter a new payment collection record.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Customer</Label>
               <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    items={customers.map(c => ({ value: c.id, label: c.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    onSearchChange={setCustomerSearch}
                    placeholder="Search for a customer..."
                    notfoundtext="No customers found."
                  />
                )}
              />
              {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id.message}</p>}
            </div>

             <div className="space-y-2">
              <Label htmlFor="chit_group_id">Chit Group</Label>
              <Controller
                name="chit_group_id"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={!selectedCustomerId || chitGroups.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chit group" />
                    </SelectTrigger>
                    <SelectContent>
                      {chitGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.group_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.chit_group_id && <p className="text-sm text-red-500">{errors.chit_group_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label htmlFor="payment_date">Payment Date</Label>
                <Input id="payment_date" type="date" {...register('payment_date')} />
                {errors.payment_date && <p className="text-sm text-red-500">{errors.payment_date.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                 <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                             <SelectItem key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference_id">Reference ID (Optional)</Label>
              <Input id="reference_id" {...register('reference_id')} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Recording Collection...' : 'Record Collection'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCollection; 