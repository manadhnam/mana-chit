
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/solid';
import LocationHierarchy from '@/components/location/LocationHierarchy';

const SuperAdminLocations: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <MapPinIcon className="h-8 w-8 text-primary-500" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Location Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your organization's location hierarchy
            </p>
          </div>
        </div>
      </div>

      {/* Location Hierarchy */}
      <LocationHierarchy />
    </motion.div>
  );
};

export default SuperAdminLocations; 