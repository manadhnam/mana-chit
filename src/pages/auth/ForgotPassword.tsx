import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Phone, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const { login, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  
  const [mobile, setMobile] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mobile
    if (!mobile || mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setFormError('');
    await login(mobile);
    
    if (!error) {
      toast.success('OTP sent successfully!');
      navigate('/verify-otp');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Reset Password
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter your registered mobile number to receive an OTP
      </p>

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
        <div className="mb-6">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="mobile"
              type="text"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setMobile(value);
                  setFormError('');
                }
              }}
              placeholder="Enter your registered mobile number"
              className={`w-full pl-10 pr-3 py-2 border ${
                formError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              maxLength={10}
            />
          </div>
          {formError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;