import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';


import { useAuthStore } from '@/store/authStore';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  aadharNumber: string;
  panNumber: string;
  profileImage?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments: {
    aadharCard?: string;
    panCard?: string;
    addressProof?: string;
  };
  accountSummary: {
    totalLoans: number;
    activeLoans: number;
    totalChitGroups: number;
    activeChitGroups: number;
  };
}

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerProfile>>({});

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProfile(user as CustomerProfile);
      setFormData(user as Partial<CustomerProfile>);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          ...formData,
          id: prev.id,
        };
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof CustomerProfile['kycDocuments']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          kycDocuments: {
            ...prev.kycDocuments,
            [documentType]: file.name,
          },
          id: prev.id,
        };
      });
      
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getKycStatusColor = (status: CustomerProfile['kycStatus']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        {/* <ArrowLeftIcon className="h-5 w-5 mr-2" /> */}
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input type="text" value={profile.name} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" value={profile.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input type="tel" value={profile.mobile} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <input type="text" value={profile.address} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loans</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{profile.accountSummary.activeLoans} / {profile.accountSummary.totalLoans} Active</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chit Groups</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{profile.accountSummary.activeChitGroups} / {profile.accountSummary.totalChitGroups} Active</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No profile found.</div>
        )}
      </div>
    </div>
  );
};

export default Profile; 