import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode as QrCodeIcon } from 'lucide-react';
import type { User } from '@/types/database';

// Define the QRCode type locally as it's not in the global types
export interface QRCode {
  id: string;
  branch_id: string;
  assigned_to?: string | null;
  status: 'active' | 'inactive' | 'assigned';
  created_at: string;
}

const qrSchema = z.object({
  assigned_to: z.string().uuid().nullable().optional(),
  status: z.enum(['active', 'inactive', 'assigned']),
});

type QrFormData = z.infer<typeof qrSchema>;

const QRManagement = () => {
  const { user } = useAuthStore();
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { handleSubmit, control, reset, watch } = useForm<QrFormData>({
    resolver: zodResolver(qrSchema),
    defaultValues: { status: 'active', assigned_to: null },
  });

  const assignedToValue = watch('assigned_to');
  const branchId = useMemo(() => user?.branch_id, [user]);

  const fetchData = async () => {
    if (!branchId) {
      setError('Branch information is not available for this user.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data: qrData, error: qrError } = await supabase.from('qrcodes').select('*').eq('branch_id', branchId);
      if (qrError) throw new Error(`Failed to fetch QR codes: ${qrError.message}`);
      setQrs(qrData || []);

      const { data: agentData, error: agentError } = await supabase.from('users').select('*').eq('branch_id', branchId).eq('role', 'agent');
      if (agentError) throw new Error(`Failed to fetch agents: ${agentError.message}`);
      setAgents(agentData || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [branchId]);

  const onSubmit = async (formData: QrFormData) => {
    if (!branchId) {
      toast.error('Cannot generate QR code without branch information.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('qrcodes')
        .insert({
          branch_id: branchId,
          assigned_to: formData.assigned_to,
          status: formData.assigned_to ? 'assigned' : 'active',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('New QR code generated successfully!');
      setQrs(prev => [data, ...prev]);
      reset({ status: 'active', assigned_to: null });

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate QR code.');
    }
  };

  const currentStatus = assignedToValue ? 'assigned' : 'active';

  if (loading) return <div className="p-8 text-center">Loading QR codes...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Generate and manage QR codes for agents in your branch.
          </p>
        </div>
      </div>
      
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center"><QrCodeIcon className="mr-2"/>Generate New QR Code</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
                <label>Assign to Agent (Optional)</label>
                <Controller name="assigned_to" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger><SelectValue placeholder="Select an agent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None (Unassigned)</SelectItem>
                            {agents.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )} />
            </div>
            <div className="space-y-2">
                <label>Initial Status</label>
                <Input value={currentStatus} disabled />
                 <p className="text-xs text-gray-500">Status becomes 'assigned' if an agent is selected.</p>
            </div>
            <Button type="submit">Generate QR Code</Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {qrs.map((qr) => (
              <tr key={qr.id}>
                <td className="px-6 py-4 font-mono">{qr.id}</td>
                <td className="px-6 py-4">{qr.status}</td>
                <td className="px-6 py-4">{agents.find(a => a.id === qr.assigned_to)?.name || 'Unassigned'}</td>
                <td className="px-6 py-4">{new Date(qr.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QRManagement; 