import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Trash2,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

const RoleManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', level: 1, permissions: [] as string[] });

  useEffect(() => {
    // Simulate loading roles and permissions data
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockPermissions: Permission[] = [
          {
            id: '1',
            name: 'manage_users',
            description: 'Can create, edit, and delete users',
            category: 'User Management',
          },
          {
            id: '2',
            name: 'view_reports',
            description: 'Can view system reports',
            category: 'Reports',
          },
          {
            id: '3',
            name: 'manage_roles',
            description: 'Can manage roles and permissions',
            category: 'Role Management',
          },
          {
            id: '4',
            name: 'manage_branches',
            description: 'Can manage branch operations',
            category: 'Branch Management',
          },
        ];

        const mockRoles: Role[] = [
          {
            id: '1',
            name: 'Super Admin',
            description: 'Full system access with all permissions',
            permissions: ['1', '2', '3', '4'],
            userCount: 1,
            isSystem: true,
          },
          {
            id: '2',
            name: 'Department Head',
            description: 'Manages department operations and staff',
            permissions: ['1', '2', '4'],
            userCount: 3,
            isSystem: true,
          },
          {
            id: '3',
            name: 'Mandal Head',
            description: 'Manages mandal operations and staff',
            permissions: ['1', '2', '4'],
            userCount: 5,
            isSystem: true,
          },
        ];

        setPermissions(mockPermissions);
        setRoles(mockRoles);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter roles
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  };

  const getPermissionCategory = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission ? permission.category : 'Other';
  };

  // Add Role Handler (Supabase)
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, level, permissions } = formData;
    const { error } = await supabase
      .from('roles')
      .insert([
        {
          name,
          description,
          level: Number(level),
          permissions,
        },
      ]);
    if (error) {
      toast.error('Failed to add role!');
      return;
    }
    toast.success('Role added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', description: '', level: 1, permissions: [] });
    // Optionally: refetch roles here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage system roles and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <User className="h-4 w-4 mr-2" />
            Add Role
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {role.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  {role.isSystem && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                      System
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </p>
                <div className="space-y-2">
                  {role.permissions.map((permissionId) => (
                    <div
                      key={permissionId}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getPermissionName(permissionId)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getPermissionCategory(permissionId)}
                        </p>
                      </div>
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role.userCount} users assigned
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      {(showAddModal || selectedRole) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {selectedRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              
              <form className="space-y-4" onSubmit={handleAddRole}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter role name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter role description"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Level
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter role level"
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Permissions
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [...formData.permissions, permission.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(id => id !== permission.id),
                              });
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={permission.id}
                          className="ml-2 block text-sm text-gray-900 dark:text-white"
                        >
                          {permission.name}
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {permission.description}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedRole(null);
                      setFormData({ name: '', description: '', level: 1, permissions: [] });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {selectedRole ? 'Update Role' : 'Add Role'}
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

export default RoleManagement; 