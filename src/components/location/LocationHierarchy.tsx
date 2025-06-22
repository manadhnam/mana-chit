import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  HomeIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { useLocationStore, Location } from '../../stores/locationStore';

interface LocationHierarchyProps {
  onLocationSelect?: (locationId: string) => void;
}

const LocationHierarchy: React.FC<LocationHierarchyProps> = ({ onLocationSelect }) => {
  const {
    locations,
    selectedLocation,
    isLoading,
    error,
    setSelectedLocation,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationsByType,
    getLocationHierarchy
  } = useLocationStore();

  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    type: 'district',
    status: 'active'
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      onLocationSelect?.(locationId);
    }
  };

  const handleAddLocation = () => {
    setIsAddingLocation(true);
    setIsEditingLocation(false);
    setNewLocation({
      type: 'district',
      status: 'active'
    });
  };

  const handleEditLocation = (location: Location) => {
    setIsEditingLocation(true);
    setIsAddingLocation(true);
    setNewLocation(location);
  };

  const handleDeleteLocation = async (location: Location) => {
    if (window.confirm(`Are you sure you want to delete ${location.name}?`)) {
      try {
        deleteLocation(location.id);
        toast.success('Location deleted successfully');
      } catch (error) {
        toast.error('Failed to delete location');
      }
    }
  };

  const handleSaveLocation = () => {
    // Validate required fields
    if (!newLocation.name || !newLocation.code) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditingLocation && newLocation.id) {
        updateLocation(newLocation.id, newLocation);
        toast.success('Location updated successfully');
      } else {
        addLocation(newLocation as Omit<Location, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Location added successfully');
      }
      setIsAddingLocation(false);
      setIsEditingLocation(false);
      setNewLocation({
        type: 'district',
        status: 'active'
      });
    } catch (error) {
      toast.error('Failed to save location');
    }
  };

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'district':
        return <MapPinIcon className="h-5 w-5 text-blue-500" />;
      case 'mandal':
        return <BuildingOfficeIcon className="h-5 w-5 text-green-500" />;
      case 'village':
        return <HomeIcon className="h-5 w-5 text-yellow-500" />;
      case 'branch':
        return <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <MapPinIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getParentLocations = (type: Location['type']) => {
    switch (type) {
      case 'mandal':
        return getLocationsByType('district');
      case 'village':
        return getLocationsByType('mandal');
      case 'branch':
        return getLocationsByType('village');
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Hierarchy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location Hierarchy</h3>
          <button
            onClick={handleAddLocation}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Location
          </button>
        </div>

        {/* Add/Edit Location Form */}
        {isAddingLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {isEditingLocation ? 'Edit Location' : 'Add New Location'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={newLocation.type}
                  onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as Location['type'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="district">District</option>
                  <option value="mandal">Mandal</option>
                  <option value="village">Village</option>
                  <option value="branch">Branch</option>
                </select>
              </div>
              {newLocation.type !== 'district' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Location</label>
                  <select
                    value={newLocation.parentId}
                    onChange={(e) => setNewLocation({ ...newLocation, parentId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                  >
                    <option value="">Select Parent</option>
                    {getParentLocations(newLocation.type as Location['type']).map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={newLocation.name || ''}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                <input
                  type="text"
                  value={newLocation.code || ''}
                  onChange={(e) => setNewLocation({ ...newLocation, code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={newLocation.status}
                  onChange={(e) => setNewLocation({ ...newLocation, status: e.target.value as Location['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsAddingLocation(false);
                  setIsEditingLocation(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isEditingLocation ? 'Update' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Location List */}
        <div className="space-y-4">
          {Object.entries(getLocationHierarchy()).map(([type, typeLocations]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{type}s</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationSelect(location.id)}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedLocation?.id === location.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getLocationIcon(location.type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{location.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{location.code}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status: <span className={location.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                              {location.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLocation(location);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLocation(location);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationHierarchy; 