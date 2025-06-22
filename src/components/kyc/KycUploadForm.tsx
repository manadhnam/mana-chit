import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

type Inputs = {
  pan_card: FileList;
  aadhaar_card: FileList;
};

const KycUploadForm = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Inputs>();
  const user = useAuthStore((state) => state.user);
  const [uploading, setUploading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) {
      toast.error('You must be logged in to submit KYC.');
      return;
    }
    
    setUploading(true);
    const panFile = data.pan_card[0];
    const aadhaarFile = data.aadhaar_card[0];

    try {
      // 1. Upload PAN Card
      const panPath = `kyc/${user.id}/pan_${panFile.name}`;
      const { error: panError } = await supabase.storage
        .from('kyc-documents')
        .upload(panPath, panFile);
      if (panError) throw panError;

      // 2. Upload Aadhaar Card
      const aadhaarPath = `kyc/${user.id}/aadhaar_${aadhaarFile.name}`;
      const { error: aadhaarError } = await supabase.storage
        .from('kyc-documents')
        .upload(aadhaarPath, aadhaarFile);
      if (aadhaarError) throw aadhaarError;

      // 3. Get public URLs
      const { data: panUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(panPath);
      const { data: aadhaarUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(aadhaarPath);

      // 4. Update user's record
      const { error: updateUserError } = await supabase
        .from('users')
        .update({
          kyc_status: 'submitted',
          kyc_documents: {
            pan_url: panUrlData.publicUrl,
            aadhaar_url: aadhaarUrlData.publicUrl,
          },
        })
        .eq('id', user.id);
      
      if (updateUserError) throw updateUserError;

      toast.success('KYC documents submitted successfully for review!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit documents.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Submit KYC Documents</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="pan_card" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            PAN Card
          </label>
          <input
            id="pan_card"
            type="file"
            {...register('pan_card', { required: true })}
            accept="image/png, image/jpeg, application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label htmlFor="aadhaar_card" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Aadhaar Card
          </label>
          <input
            id="aadhaar_card"
            type="file"
            {...register('aadhaar_card', { required: true })}
            accept="image/png, image/jpeg, application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting || uploading ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </form>
    </div>
  );
};

export default KycUploadForm; 