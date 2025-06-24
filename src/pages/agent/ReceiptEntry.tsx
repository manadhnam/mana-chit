import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CameraIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import SignaturePad from 'react-signature-canvas';
import { supabase } from '@/lib/supabase';
import { Customer, Receipt } from '@/types/database';
import { log_audit } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// Helper to convert base64 to a File object for uploading
const base64toFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const ReceiptEntry = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'bank_transfer' | 'upi'>('cash');
  const [notes, setNotes] = useState<string>('');
  const [customerSignature, setCustomerSignature] = useState<string>('');
  
  const signaturePadRef = useRef<SignaturePad>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuthStore();

  const fetchAgentData = async () => {
    if (!user || !user.branch_id) return;
    setLoading(true);
    try {
      const [customerRes, receiptRes] = await Promise.all([
        supabase.from('customers').select('*').eq('branch_id', user.branch_id),
        supabase.from('receipts').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
      ]);

      if (customerRes.error) throw customerRes.error;
      if (receiptRes.error) throw receiptRes.error;

      setCustomers(customerRes.data as Customer[]);
      setReceipts(receiptRes.data as Receipt[]);

    } catch (error: any) {
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, [user]);

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('receipts').upload(path, file);
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !paymentAmount || !user || !user.branch_id) {
      toast.error('Please select a customer and enter a payment amount.');
      return;
    }
    if (!customerSignature) {
      toast.error('Customer signature is required.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting receipt...');

    try {
      const customer = customers.find((c) => c.id === selectedCustomer);
      if (!customer) {
        throw new Error('Selected customer not found.');
      }

      const receiptId = uuidv4();
      let customerSignatureUrl = '';

      // Upload signature
      toast.loading('Uploading signature...', { id: toastId });
      const signatureFile = base64toFile(customerSignature, `signature-${receiptId}.png`);
      customerSignatureUrl = await uploadFile(signatureFile, `${user.id}/${receiptId}/signature.png`);
      
      const newReceiptPayload: Omit<Receipt, 'id' | 'created_at' | 'updated_at' | 'receipt_number'> = {
        customer_id: selectedCustomer,
        amount: parseFloat(paymentAmount),
        payment_date: new Date().toISOString(),
        payment_mode: paymentMode,
        status: 'pending', // Or 'approved' depending on business logic
        notes,
        customer_signature_url: customerSignatureUrl,
        created_by: user.id,
        branch_id: user.branch_id,
      };

      toast.loading('Saving receipt details...', { id: toastId });
      const { data: insertedReceipt, error } = await supabase
        .from('receipts')
        .insert(newReceiptPayload)
        .select()
        .single();
      
      if (error) throw error;

      await log_audit('receipt.create', { receiptId: insertedReceipt.id, customerId: selectedCustomer }, user.id);
      
      toast.success('Receipt submitted successfully!', { id: toastId });
      
      setReceipts((prev) => [insertedReceipt, ...prev]);
      resetForm();

    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setPaymentAmount('');
    setPaymentMode('cash');
    setNotes('');
    setCustomerSignature('');
    if (signaturePadRef.current) {
        signaturePadRef.current.clear();
    }
  };

  const handleSignatureSave = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setCustomerSignature(signatureData);
      toast.success('Signature captured!');
    }
  };

  // Simplified and removed camera logic for now to focus on core functionality.
  // PDF generation is also a TODO for a future ticket.
  const generatePDF = async (receipt: Receipt) => {
    // TODO: Implement PDF generation with jsPDF or similar
    toast('PDF generation is not yet implemented.', { icon: 'ℹ️' });
  };
  
  const selectedCustomerDetails = customers.find(c => c.id === selectedCustomer);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Receipt Entry</h1>

        {/* Receipt Creation Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Selection */}
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Customer
              </label>
              <select
                id="customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="" disabled>-- Select a customer --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
              </select>
            </div>

            {/* Payment Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter amount"
                required
              />
            </div>
            
            {/* Payment Mode */}
            <div>
              <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Mode
              </label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Any additional notes..."
              />
            </div>

            {/* Signature Pad */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Signature</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-2">
                    <SignaturePad
                        ref={signaturePadRef}
                        canvasProps={{ className: 'w-full h-40 bg-gray-50 dark:bg-gray-700 rounded' }}
                    />
                </div>
                <div className="flex items-center justify-end space-x-2 mt-2">
                    <button type="button" onClick={() => signaturePadRef.current?.clear()} className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">Clear</button>
                    <button type="button" onClick={handleSignatureSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">Save Signature</button>
                </div>
                 {customerSignature && <img src={customerSignature} alt="Customer Signature" className="mt-2 h-16 border rounded" />}
            </div>
          </div>
          
          <div className="mt-6 text-right">
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
                {submitting ? 'Submitting...' : 'Submit Receipt'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReceiptEntry; 