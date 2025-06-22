import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const { verifyOtp, isOtpSent, tempMobile, login, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Redirect if OTP wasn't sent
  useEffect(() => {
    if (!isOtpSent && !tempMobile) {
      navigate('/login');
    }
  }, [isOtpSent, tempMobile, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setFormError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setFormError('');
    await verifyOtp(tempMobile, otp);
    
    if (error) {
      toast.error(error);
      clearError();
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    await login(tempMobile);
    setTimeLeft(30);
    setCanResend(false);
    
    if (!error) {
      toast.success('OTP resent successfully!');
    } else {
      toast.error(error);
      clearError();
    }
  };

  if (!isOtpSent && !tempMobile) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Verify your mobile
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter the 6-digit code sent to {tempMobile}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <motion.form 
        onSubmit={handleVerifyOtp}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 6) {
                  setOtp(value);
                  setFormError('');
                }
              }}
              placeholder="Enter 6-digit OTP"
              className={`w-full pl-10 pr-3 py-3 text-center text-lg tracking-widest border ${
                formError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              maxLength={6}
            />
          </div>
          {formError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formError}</p>
          )}
        </div>

        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`text-sm ${
              canResend 
                ? 'text-primary-600 hover:text-primary-500 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            } font-medium`}
          >
            {canResend 
              ? 'Resend OTP' 
              : `Resend OTP in ${timeLeft}s`
            }
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center mx-auto text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default VerifyOTP;