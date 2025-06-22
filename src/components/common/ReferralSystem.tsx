import React, { useState } from 'react';
import { Share2, Users, Award, Copy } from 'lucide-react';

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  createdAt: string;
  completedAt?: string;
}

interface ReferralSystemProps {
  userId: string;
  referralCode: string;
  referrals: Referral[];
  totalRewards: number;
  onShare: (platform: 'whatsapp' | 'telegram' | 'email') => void;
  onCopyLink: () => void;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  userId,
  referralCode,
  referrals,
  totalRewards,
  onShare,
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-semibold">{referrals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Rewards</p>
              <p className="text-2xl font-semibold">₹{totalRewards}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Referral Code</p>
              <p className="text-2xl font-semibold">{referralCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Share Your Referral Code</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onShare('whatsapp')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Share2 className="w-5 h-5" />
            <span>Share on WhatsApp</span>
          </button>
          <button
            onClick={() => onShare('telegram')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Share2 className="w-5 h-5" />
            <span>Share on Telegram</span>
          </button>
          <button
            onClick={() => onShare('email')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Share2 className="w-5 h-5" />
            <span>Share via Email</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Referral History</h2>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">Referred User: {referral.referredId}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(referral.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    referral.status
                  )}`}
                >
                  {referral.status}
                </span>
                <span className="font-medium">₹{referral.rewardAmount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem; 