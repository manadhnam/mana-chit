import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const roles = [
  {
    id: 'superAdmin',
    name: 'Super Admin',
    description: 'System administration and global management',
    icon: CogIcon,
  },
  {
    id: 'departmentHead',
    name: 'Department Head',
    description: 'Department-level oversight and management',
    icon: BuildingOfficeIcon,
  },
  {
    id: 'mandalHead',
    name: 'Mandal Head',
    description: 'Manage multiple branches and oversee operations',
    icon: BuildingOfficeIcon,
  },
  {
    id: 'branchManager',
    name: 'Branch Manager',
    description: 'Manage branch operations and staff',
    icon: ShieldCheckIcon,
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'Handle customer interactions and collections',
    icon: UserIcon,
  },
  {
    id: 'user',
    name: 'Customer',
    description: 'Access loan and chit group services',
    icon: UserCircleIcon,
  },
];

const RoleLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !mobile) {
      setError('Please select a role and enter mobile number');
      return;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Mock OTP sending - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
      toast.success('OTP sent to your mobile number');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await login(mobile, otp, selectedRole as any);
      toast.success('Login successful!');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoMobile: string, demoRole: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(demoMobile, '123456', demoRole as any);
      toast.success('Demo login successful!');
    } catch (error) {
      setError('Demo login failed');
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <div>
          <UserIcon className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isOtpSent ? 'Verify OTP' : 'Sign in to your account'}
          </h2>
        </div>

        {!isOtpSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1">
                  OTP sent to {mobile}
                </p>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Demo Login (Use OTP: 123456)
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {roles.slice(0, 4).map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleDemoLogin('9999999999', role.id)}
                disabled={isLoading}
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <role.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <div className="text-left">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">{role.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleLogin; 