import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


interface PrivacySettings {
  shareData: boolean;
  marketingEmails: boolean;
  thirdPartyAccess: boolean;
}

const mockSettings: PrivacySettings = {
  shareData: true,
  marketingEmails: false,
  thirdPartyAccess: false,
};

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<PrivacySettings>(mockSettings);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call to save settings
    setTimeout(() => {
      console.log('Privacy settings saved:', settings);
      setIsLoading(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.shareData}
                  onChange={() => handleToggle('shareData')}
                  className="mr-2"
                />
                Share Data with Partners
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                  className="mr-2"
                />
                Receive Marketing Emails
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={settings.thirdPartyAccess}
                  onChange={() => handleToggle('thirdPartyAccess')}
                  className="mr-2"
                />
                Allow Third-Party Access
              </label>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings; 