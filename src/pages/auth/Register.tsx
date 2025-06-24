import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { User, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import IdProofUpload from '../../components/IdProofUpload';

const Register = () => {
  const { register, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    idProof: null as File | null,
    idType: 'AADHAR' as 'AADHAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE'
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    mobile: '',
    email: '',
    idProof: ''
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    setFormErrors({ ...formErrors, [name]: '' });
  };

  // Handle ID proof upload
  const handleIdProofUpload = (file: File, type: 'AADHAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE') => {
    setFormData({ ...formData, idProof: file, idType: type });
    setFormErrors({ ...formErrors, idProof: '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    const newErrors = { name: '', mobile: '', email: '', idProof: '' };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.mobile || formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.idProof) {
      newErrors.idProof = 'ID proof is required';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      const { idProof, idType, ...userFields } = formData;
      await register({
        ...userFields
        // idProof is not part of the canonical User type, so do not include it
      });
      
      if (!error) {
        toast.success('Registration successful! Please verify OTP to continue.');
        navigate('/verify-otp');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full pl-10 pr-3 py-2 border ${
                formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            />
          </div>
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="mobile"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              className={`w-full pl-10 pr-3 py-2 border ${
                formErrors.mobile ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              maxLength={10}
            />
          </div>
          {formErrors.mobile && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.mobile}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-3 py-2 border ${
                formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID Proof
          </label>
          <IdProofUpload
            onUpload={handleIdProofUpload}
            error={formErrors.idProof}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default Register;