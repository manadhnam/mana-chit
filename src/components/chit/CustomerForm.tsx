import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloudIcon } from 'lucide-react';

const customerSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  mobile: z.string().min(10, 'A valid 10-digit phone number is required'),
  address: z.string().min(10, 'A valid address is required'),
  id_proof: z.instanceof(File).optional(),
  photo: z.instanceof(File).optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  branchId: string;
  onSuccess: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ branchId, onSuccess }) => {
  const { user: agentUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, getValues, control } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'id_proof' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'id_proof') setIdProofPreview(reader.result as string);
        if (field === 'photo') setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof CustomerFormData)[] = 
      currentStep === 1 ? ['name', 'email', 'mobile'] :
      currentStep === 2 ? ['address'] : [];
      
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (formData: CustomerFormData) => {
    if (!agentUser) {
      toast.error('You must be logged in to add a customer.');
      return;
    }

    try {
      let idProofUrl: string | undefined = undefined;
      if (formData.id_proof) {
        const filePath = `id-proofs/${agentUser.id}_${Date.now()}_${formData.id_proof.name}`;
        const { data, error } = await supabase.storage.from('customer-documents').upload(filePath, formData.id_proof);
        if (error) throw new Error(`ID Proof upload failed: ${error.message}`);
        idProofUrl = supabase.storage.from('customer-documents').getPublicUrl(data.path).data.publicUrl;
      }

      let photoUrl: string | undefined = undefined;
      if (formData.photo) {
        const filePath = `photos/${agentUser.id}_${Date.now()}_${formData.photo.name}`;
        const { data, error } = await supabase.storage.from('customer-documents').upload(filePath, formData.photo);
        if (error) throw new Error(`Photo upload failed: ${error.message}`);
        photoUrl = supabase.storage.from('customer-documents').getPublicUrl(data.path).data.publicUrl;
      }
      
      // 1. Create the user record for the customer
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          role: 'customer',
          status: 'pending_approval',
          branch_id: branchId,
          id_proof_file: idProofUrl,
          photo_url: photoUrl,
        })
        .select()
        .single();
        
      if (userError) throw new Error(`Could not create user: ${userError.message}`);
      if (!newUser) throw new Error('User creation failed.');

      // 2. Create the customer profile, linking the agent
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: newUser.id,
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          address: formData.address,
          agent_id: agentUser.id,
          branch_id: branchId,
          status: 'pending_approval',
          created_by: agentUser.id,
          id_proof_url: idProofUrl,
          photo_url: photoUrl,
        });
        
      if (customerError) {
        // Attempt to roll back user creation
        await supabase.from('users').delete().eq('id', newUser.id);
        throw new Error(`Could not create customer profile: ${customerError.message}`);
      }

      toast.success('Customer created successfully and is pending approval.');
      onSuccess();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Step 1: Personal Information</h3>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input id="mobile" {...register('mobile')} />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Address & Documents */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Step 2: Address & Documents</h3>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Proof Upload */}
            <div className="space-y-2">
              <Label htmlFor="id_proof">ID Proof (Aadhaar, etc.)</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {idProofPreview ? (
                    <img src={idProofPreview} alt="ID Proof Preview" className="mx-auto h-24 w-auto object-contain rounded-md"/>
                  ) : (
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <Controller
                      name="id_proof"
                      control={control}
                      render={({ field }) => (
                        <label htmlFor="id_proof_input" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Upload a file</span>
                          <input id="id_proof_input" type="file" className="sr-only" onChange={e => { field.onChange(e.target.files?.[0]); handleFileChange(e, 'id_proof'); }} />
                        </label>
                      )}
                    />
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Customer Photo</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {photoPreview ? (
                     <img src={photoPreview} alt="Photo Preview" className="mx-auto h-24 w-24 object-cover rounded-full"/>
                  ) : (
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <Controller
                      name="photo"
                      control={control}
                      render={({ field }) => (
                        <label htmlFor="photo_input" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                           <span>Upload a file</span>
                           <input id="photo_input" type="file" className="sr-only" onChange={e => { field.onChange(e.target.files?.[0]); handleFileChange(e, 'photo'); }}/>
                        </label>
                      )}
                    />
                     <p className="pl-1">or drag and drop</p>
                  </div>
                   <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 3: Review & Submit */}
      {currentStep === 3 && (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Step 3: Review and Submit</h3>
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 space-y-4">
                <div>
                    <h4 className="font-semibold">Personal Details</h4>
                    <p><strong>Name:</strong> {getValues('name')}</p>
                    <p><strong>Email:</strong> {getValues('email')}</p>
                    <p><strong>Mobile:</strong> {getValues('mobile')}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Address</h4>
                    <p>{getValues('address')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold">ID Proof</h4>
                        {idProofPreview && <img src={idProofPreview} alt="ID Preview" className="w-full rounded-md mt-2"/>}
                    </div>
                    <div>
                        <h4 className="font-semibold">Photo</h4>
                        {photoPreview && <img src={photoPreview} alt="Photo Preview" className="w-32 h-32 object-cover rounded-full mt-2"/>}
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Please review all the customer details carefully before submitting for approval.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-4 flex justify-between">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        )}
        {currentStep < 3 && (
          <Button type="button" onClick={handleNextStep} className="ml-auto">
            Next
          </Button>
        )}
        {currentStep === 3 && (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        )}
      </div>
    </form>
  );
}; 