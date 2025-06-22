import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface ChitGroupRange {
  id: string;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  commission: number;
  interestRate: number;
  duration: number;
  maxMembers: number;
  isActive: boolean;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
}

interface ChitGroupConfigProps {
  onSave?: (config: any) => void;
  onCancel?: () => void;
}

const ChitGroupConfiguration: React.FC<ChitGroupConfigProps> = ({ onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'ranges' | 'settings' | 'risk' | 'notifications'>('ranges');
  const [ranges, setRanges] = useState<ChitGroupRange[]>([]);
  const [showRangeForm, setShowRangeForm] = useState(false);
  const [editingRange, setEditingRange] = useState<ChitGroupRange | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [rangeForm, setRangeForm] = useState({
    minAmount: 1000,
    maxAmount: 20000,
    stepAmount: 1000,
    commission: 5,
    interestRate: 12,
    duration: 12,
    maxMembers: 20,
    description: '',
    riskLevel: 'LOW',
  });

  const [globalSettings, setGlobalSettings] = useState({
    maxGroupsPerCustomer: 3,
    maxActiveGroupsPerCustomer: 2,
    minDaysBetweenAuctions: 7,
    maxDaysBetweenPayments: 30,
    lateFeePercentage: 2,
    defaultCommission: 5,
    defaultInterestRate: 12,
    autoApprovalEnabled: true,
    requireManagerApproval: false,
    requireDocumentVerification: true,
  });

  const [riskConfig, setRiskConfig] = useState({
    lowRiskThreshold: 70,
    mediumRiskThreshold: 40,
    highRiskThreshold: 0,
    factors: [
      { id: '1', name: 'Age', weight: 10, description: 'Customer age factor' },
      { id: '2', name: 'Income', weight: 25, description: 'Monthly income stability' },
      { id: '3', name: 'Credit Score', weight: 20, description: 'Credit history score' },
      { id: '4', name: 'Employment History', weight: 15, description: 'Years of employment' },
      { id: '5', name: 'Existing Loans', weight: 15, description: 'Number of active loans' },
      { id: '6', name: 'Bank Balance', weight: 15, description: 'Average bank balance' },
    ],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    auctionReminders: true,
    paymentReminders: true,
    overdueNotifications: true,
    groupUpdates: true,
    documentExpiry: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    loadRanges();
  }, []);

  const loadRanges = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockRanges: ChitGroupRange[] = [
        {
          id: '1',
          minAmount: 1000,
          maxAmount: 5000,
          stepAmount: 500,
          commission: 3,
          interestRate: 10,
          duration: 12,
          maxMembers: 15,
          isActive: true,
          description: 'Small amount chit groups for beginners',
          riskLevel: 'LOW',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          minAmount: 5000,
          maxAmount: 15000,
          stepAmount: 1000,
          commission: 5,
          interestRate: 12,
          duration: 18,
          maxMembers: 20,
          isActive: true,
          description: 'Medium amount chit groups for regular users',
          riskLevel: 'MEDIUM',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          minAmount: 15000,
          maxAmount: 20000,
          stepAmount: 2000,
          commission: 7,
          interestRate: 15,
          duration: 24,
          maxMembers: 25,
          isActive: true,
          description: 'Large amount chit groups for high-value customers',
          riskLevel: 'HIGH',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setRanges(mockRanges);
    } catch (error) {
      toast.error('Failed to load chit group ranges');
    } finally {
      setLoading(false);
    }
  };

  const handleRangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRange) {
        // Update existing range
        const updatedRanges = ranges.map(range =>
          range.id === editingRange.id
            ? { ...range, ...rangeForm, riskLevel: rangeForm.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH', updatedAt: new Date() }
            : range
        );
        setRanges(updatedRanges);
        toast.success('Range updated successfully');
      } else {
        // Create new range
        const newRange: ChitGroupRange = {
          id: Date.now().toString(),
          ...rangeForm,
          riskLevel: rangeForm.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setRanges([...ranges, newRange]);
        toast.success('Range created successfully');
      }

      setShowRangeForm(false);
      setEditingRange(null);
      resetRangeForm();
    } catch (error) {
      toast.error('Failed to save range');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRange = (range: ChitGroupRange) => {
    setEditingRange(range);
    setRangeForm({
      minAmount: range.minAmount,
      maxAmount: range.maxAmount,
      stepAmount: range.stepAmount,
      commission: range.commission,
      interestRate: range.interestRate,
      duration: range.duration,
      maxMembers: range.maxMembers,
      description: range.description,
      riskLevel: range.riskLevel,
    });
    setShowRangeForm(true);
  };

  const handleDeleteRange = async (rangeId: string) => {
    if (window.confirm('Are you sure you want to delete this range?')) {
      try {
        const updatedRanges = ranges.filter(range => range.id !== rangeId);
        setRanges(updatedRanges);
        toast.success('Range deleted successfully');
      } catch (error) {
        toast.error('Failed to delete range');
      }
    }
  };

  const handleToggleRangeStatus = async (rangeId: string) => {
    try {
      const updatedRanges = ranges.map(range =>
        range.id === rangeId
          ? { ...range, isActive: !range.isActive, updatedAt: new Date() }
          : range
      );
      setRanges(updatedRanges);
      toast.success('Range status updated');
    } catch (error) {
      toast.error('Failed to update range status');
    }
  };

  const resetRangeForm = () => {
    setRangeForm({
      minAmount: 1000,
      maxAmount: 20000,
      stepAmount: 1000,
      commission: 5,
      interestRate: 12,
      duration: 12,
      maxMembers: 20,
      description: '',
      riskLevel: 'LOW',
    });
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const config = {
        ranges,
        globalSettings,
        riskAssessment: riskConfig,
        notificationSettings,
      };
      
      if (onSave) {
        onSave(config);
      }
      
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'ranges', name: 'Chit Group Ranges', icon: CurrencyDollarIcon },
    { id: 'settings', name: 'Global Settings', icon: CogIcon },
    { id: 'risk', name: 'Risk Assessment', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chit Group Configuration
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure chit group ranges, settings, and risk assessment
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'ranges' && (
          <div className="space-y-6">
            {/* Add Range Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Chit Group Ranges
              </h3>
              <button
                onClick={() => setShowRangeForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Range
              </button>
            </div>

            {/* Ranges List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading ranges...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ranges.map((range) => (
                  <motion.div
                    key={range.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          ₹{range.minAmount.toLocaleString()} - ₹{range.maxAmount.toLocaleString()}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(range.riskLevel)}`}>
                          {range.riskLevel} Risk
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRange(range)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRange(range.id)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {range.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Commission:</span>
                        <span className="font-medium">{range.commission}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Interest Rate:</span>
                        <span className="font-medium">{range.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">{range.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Max Members:</span>
                        <span className="font-medium">{range.maxMembers}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => handleToggleRangeStatus(range.id)}
                        className={`w-full text-sm font-medium rounded-md py-2 px-3 ${
                          range.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {range.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Global Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Customer Limits</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Groups Per Customer
                  </label>
                  <input
                    type="number"
                    value={globalSettings.maxGroupsPerCustomer}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      maxGroupsPerCustomer: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Active Groups Per Customer
                  </label>
                  <input
                    type="number"
                    value={globalSettings.maxActiveGroupsPerCustomer}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      maxActiveGroupsPerCustomer: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Payment Settings</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Late Fee Percentage
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={globalSettings.lateFeePercentage}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      lateFeePercentage: parseFloat(e.target.value)
                    })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Days Between Payments
                  </label>
                  <input
                    type="number"
                    value={globalSettings.maxDaysBetweenPayments}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      maxDaysBetweenPayments: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Approval Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.autoApprovalEnabled}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      autoApprovalEnabled: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable Auto Approval
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.requireManagerApproval}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      requireManagerApproval: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require Manager Approval
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.requireDocumentVerification}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      requireDocumentVerification: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require Document Verification
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Risk Assessment Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Low Risk Threshold
                </label>
                <input
                  type="number"
                  value={riskConfig.lowRiskThreshold}
                  onChange={(e) => setRiskConfig({
                    ...riskConfig,
                    lowRiskThreshold: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medium Risk Threshold
                </label>
                <input
                  type="number"
                  value={riskConfig.mediumRiskThreshold}
                  onChange={(e) => setRiskConfig({
                    ...riskConfig,
                    mediumRiskThreshold: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  High Risk Threshold
                </label>
                <input
                  type="number"
                  value={riskConfig.highRiskThreshold}
                  onChange={(e) => setRiskConfig({
                    ...riskConfig,
                    highRiskThreshold: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Risk Factors</h4>
              <div className="space-y-3">
                {riskConfig.factors.map((factor) => (
                  <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{factor.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Weight:</span>
                      <input
                        type="number"
                        value={factor.weight}
                        onChange={(e) => {
                          const updatedFactors = riskConfig.factors.map(f =>
                            f.id === factor.id ? { ...f, weight: parseInt(e.target.value) } : f
                          );
                          setRiskConfig({ ...riskConfig, factors: updatedFactors });
                        }}
                        className="w-16 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Notification Types</h4>
                <div className="space-y-3">
                  {Object.entries(notificationSettings).slice(0, 5).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked
                        })}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Channels</h4>
                <div className="space-y-3">
                  {Object.entries(notificationSettings).slice(5).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked
                        })}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Range Form Modal */}
      {showRangeForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingRange ? 'Edit Range' : 'Add New Range'}
              </h3>
              
              <form onSubmit={handleRangeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Min Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={rangeForm.minAmount}
                      onChange={(e) => setRangeForm({
                        ...rangeForm,
                        minAmount: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={rangeForm.maxAmount}
                      onChange={(e) => setRangeForm({
                        ...rangeForm,
                        maxAmount: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={rangeForm.commission}
                      onChange={(e) => setRangeForm({
                        ...rangeForm,
                        commission: parseFloat(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={rangeForm.interestRate}
                      onChange={(e) => setRangeForm({
                        ...rangeForm,
                        interestRate: parseFloat(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      value={rangeForm.duration}
                      onChange={(e) => setRangeForm({
                        ...rangeForm,
                        duration: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={rangeForm.description}
                    onChange={(e) => setRangeForm({
                      ...rangeForm,
                      description: e.target.value
                    })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRangeForm(false);
                      setEditingRange(null);
                      resetRangeForm();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingRange ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChitGroupConfiguration; 