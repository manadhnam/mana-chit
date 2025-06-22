import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserPlusIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Referral, User } from '@/types/database';

// A combined type for showing referral info with the referee's details
interface ReferralDetails extends Referral {
  referee_name: string;
  referee_email: string;
}

const ReferralDashboard = () => {
  const { user } = useAuthStore();
  const [referrals, setReferrals] = useState<ReferralDetails[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferralData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Fetch the current user's details to get their referral code
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('referral_code, id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      setReferralCode(userData?.referral_code || 'N/A');

      // 2. Fetch all referrals made by this user
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select(`
          *,
          referee:users!referrals_referee_id_fkey (
            name,
            email
          )
        `)
        .eq('referrer_id', user.id);

      if (referralError) throw referralError;
      
      const formattedReferrals = referralData.map((r: any) => ({
        ...r,
        referee_name: r.referee.name,
        referee_email: r.referee.email,
      }));

      setReferrals(formattedReferrals);

      // 3. Calculate total rewards from completed referrals
      const rewards = formattedReferrals
        .filter(r => r.status === 'completed' && r.reward_amount)
        .reduce((sum, r) => sum + r.reward_amount, 0);
      setTotalRewards(rewards);

    } catch (error: any) {
      toast.error('Failed to fetch referral data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [user]);

  const stats = {
    totalReferrals: referrals.length,
    approvedReferrals: referrals.filter((r) => r.status === 'completed').length,
    pendingReferrals: referrals.filter((r) => r.status === 'pending').length,
  };
  
  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const handleCopyReferralCode = () => {
    if (referralCode === 'N/A') {
        toast.error('Referral code not available.');
        return;
    }
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard');
  };

  const handleShareReferral = () => {
    if (referralCode === 'N/A') {
        toast.error('Referral code not available.');
        return;
    }
    const shareText = `Join our platform using my referral code: ${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join with my referral code!',
        text: shareText,
      }).catch(() => {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(shareText);
        toast.success('Referral message copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Referral message copied to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Referral Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Track your referrals and earn rewards for bringing new members.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <UserPlusIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Referrals</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalReferrals}</p>
            </div>
        </div>
        {/* Approved Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.approvedReferrals}</p>
            </div>
        </div>
        {/* Pending Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingReferrals}</p>
            </div>
        </div>
        {/* Total Rewards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rewards</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{totalRewards.toLocaleString()}</p>
            </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Referral Code</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Share this code with your friends to earn rewards when they join.</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={isLoading ? 'Loading...' : referralCode}
              className="px-3 py-2 w-48 text-center font-mono bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCopyReferralCode}
              className="p-2 border rounded-md bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600"
              title="Copy code"
            >
              <ClipboardDocumentIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleShareReferral}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Referrals</h2>
            <button onClick={fetchReferralData} disabled={isLoading} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading your referrals...</div>
          ) : referrals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">You haven't referred anyone yet. Share your code to get started!</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{referral.referee_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{referral.referee_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(referral.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      {referral.reward_amount ? `₹${referral.reward_amount.toLocaleString()}` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralDashboard; 