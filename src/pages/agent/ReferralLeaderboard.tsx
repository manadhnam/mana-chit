import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { StarIcon, BanknotesIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';

interface ReferralStats {
  id: string;
  name: string;
  totalReferrals: number;
  activeReferrals: number;
  totalCommission: number;
  rank: number;
  avatar?: string;
}

const ReferralLeaderboard = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [leaderboard, setLeaderboard] = useState<ReferralStats[]>([]);

  useEffect(() => {
    // Mock API call - replace with actual API
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: ReferralStats[] = [
          {
            id: '1',
            name: 'John Doe',
            totalReferrals: 25,
            activeReferrals: 20,
            totalCommission: 25000,
            rank: 1,
          },
          {
            id: '2',
            name: 'Jane Smith',
            totalReferrals: 20,
            activeReferrals: 18,
            totalCommission: 20000,
            rank: 2,
          },
          {
            id: '3',
            name: 'Mike Johnson',
            totalReferrals: 15,
            activeReferrals: 12,
            totalCommission: 15000,
            rank: 3,
          },
          // Add more mock data as needed
        ];
        
        setLeaderboard(mockData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeRange]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 2:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 3:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Referral Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Top performers in customer referrals
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : (
                leaderboard.map((agent) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {agent.rank <= 3 ? (
                          <TrophyIcon className={`h-5 w-5 ${
                            agent.rank === 1 ? 'text-yellow-400' :
                            agent.rank === 2 ? 'text-gray-400' :
                            'text-orange-400'
                          }`} />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            #{agent.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {agent.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={agent.avatar}
                              alt={agent.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {agent.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {agent.totalReferrals}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <StarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {agent.activeReferrals}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-green-500" />
                        ₹{agent.totalCommission.toLocaleString()}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferralLeaderboard; 