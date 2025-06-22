import React, { useEffect, useState } from 'react';
import { useRoleStore } from '@/store/roleStore';
import { useAuditStore } from '@/store/auditStore';
import { motion } from 'framer-motion';
import { 
  ExclamationCircleIcon, 
  PlusIcon, 
  UserGroupIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';


interface RoleManagementProps {
  onRoleSelect?: (roleId: string) => void;
}

const RoleManagement = ({ onRoleSelect }: RoleManagementProps) => {
  const { roles, fetchRoles, assignPermissions, permissions, isLoading } = useRoleStore();
  const { logAction } = useAuditStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
        setEditedPermissions(role.permissions);
      }
    }
  }, [selectedRole, roles]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onRoleSelect?.(roleId);
    logAction({
      userId: 'admin', // This should be replaced with actual user ID
      userRole: 'ADMIN',
      action: 'SELECT_ROLE',
      module: 'ROLE',
      details: { roleId },
      ipAddress: '',
      userAgent: navigator.userAgent,
    });
  };

  const handlePermissionToggle = (permissionId: string) => {
    setEditedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await assignPermissions(selectedRole, editedPermissions);
      setIsEditing(false);
      logAction({
        userId: 'admin', // This should be replaced with actual user ID
        userRole: 'ADMIN',
        action: 'UPDATE_ROLE_PERMISSIONS',
        module: 'ROLE',
        details: { roleId: selectedRole, permissions: editedPermissions },
        ipAddress: '',
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to update permissions:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roles</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Role
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(role.id)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedRole === role.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{role.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={e => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    onClick={e => e.stopPropagation()}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Role Permissions */}
      {selectedRole && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Permissions</h3>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={handleSavePermissions}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => {
                    setIsEditing(false);
                    const role = roles.find(r => r.id === selectedRole);
                    if (role) {
                      setEditedPermissions(role.permissions);
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setIsEditing(true)}
              >
                Edit Permissions
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissions.map(permission => (
              <div key={permission.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedPermissions.includes(permission.id)}
                  onChange={() => handlePermissionToggle(permission.id)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-sm text-gray-900 dark:text-white font-medium">{permission.name}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{permission.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement; 