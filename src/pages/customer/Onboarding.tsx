import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Contact Details', 'KYC Upload', 'Confirmation'];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    kycFile: null as File | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const user = useAuthStore((state) => state.user);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to complete onboarding.');
      return;
    }
    try {
      let kycUrl = '';
      if (form.kycFile) {
        const filePath = `kyc/${user.id}/kyc_${form.kycFile.name}`;
        const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(filePath, form.kycFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('kyc-documents').getPublicUrl(filePath);
        kycUrl = urlData?.publicUrl || '';
      }
      const { error: updateError } = await supabase.from('users').update({
        name: form.name,
        date_of_birth: form.dob,
        email: form.email,
        phone: form.phone,
        address: form.address,
        kyc_status: 'submitted',
        kyc_documents: { kyc_url: kycUrl },
      }).eq('id', user.id);
      if (updateError) throw updateError;
      toast.success('Onboarding complete!');
      setSubmitted(true);
      next();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete onboarding.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">Customer Onboarding</h1>
      <div className="flex mb-6 gap-2">
        {steps.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 text-center py-2 rounded ${idx === step ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            {label}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <div className="space-y-4">
            <input className="w-full border rounded px-3 py-2" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input className="w-full border rounded px-3 py-2" name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} required />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <input className="w-full border rounded px-3 py-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="w-full border rounded px-3 py-2" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input className="w-full border rounded px-3 py-2" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <input className="w-full border rounded px-3 py-2" name="kycFile" type="file" accept="image/*,.pdf" onChange={handleChange} required />
            {form.kycFile && <div className="text-sm text-gray-600 dark:text-gray-300">Selected: {form.kycFile.name}</div>}
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            {submitted ? (
              <>
                <div className="text-green-600 text-xl font-bold mb-2">Onboarding Complete!</div>
                <div className="text-gray-700 dark:text-gray-200 mb-4">Welcome, {form.name}!</div>
              </>
            ) : (
              <div className="text-gray-700 dark:text-gray-200">Please review and submit your information.</div>
            )}
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={prev} disabled={step === 0}>Back</button>
          {step < steps.length - 1 && (
            <button type="button" className="px-4 py-2 rounded bg-primary-600 text-white" onClick={next}>Next</button>
          )}
          {step === steps.length - 1 && (
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Finish</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding; 