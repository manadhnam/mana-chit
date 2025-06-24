import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  Eye,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Mock data for now - in real app, fetch from Supabase
        const mockPermissions: Permission[] = [
          {
            id: '1',
            name: 'View Users',
            description: 'Can view user information',
            category: 'User Management',
          },
          {
            id: '2',
            name: 'View Reports',
            description: 'Can access system reports',
            category: 'Reports',
          },
          {
            id: '3',
            name: 'System Settings',
            description: 'Can modify system settings',
            category: 'System',
          },
          {
            id: '4',
            name: 'Audit Logs',
            description: 'Can view audit logs',
            category: 'Security',
          },
        ];

        const mockRoles: Role[] = [
          {
            id: '1',
            name: 'Super Admin',
            description: 'Full system access with all permissions (Read-only for user management)',
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
          {
            id: '4',
            name: 'Branch Manager',
            description: 'Manages branch operations and staff',
            permissions: ['1', '2'],
            userCount: 8,
            isSystem: true,
          },
          {
            id: '5',
            name: 'Agent',
            description: 'Handles customer interactions and collections',
            permissions: ['1'],
            userCount: 25,
            isSystem: true,
          },
          {
            id: '6',
            name: 'Customer',
            description: 'Access to customer services',
            permissions: [],
            userCount: 150,
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

  const handleExportData = () => {
    const csvContent = [
      ['Role Name', 'Description', 'User Count', 'Permissions'],
      ...filteredRoles.map(role => [
        role.name,
        role.description,
        role.userCount.toString(),
        role.permissions.map(p => getPermissionName(p)).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roles-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Role data exported successfully!');
  };

  const handleViewRoleDetails = (roleId: string) => {
    // Navigate to role details view (read-only)
    window.open(`/super-admin/roles/${roleId}`, '_blank');
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
              View system roles and permissions (Read-only access)
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.userCount} users
                    </p>
                  </div>
                </div>
                {role.isSystem && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    System
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {role.description}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Permissions ({role.permissions.length})
                </h4>
                <div className="space-y-1">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((permissionId) => (
                      <div
                        key={permissionId}
                        className="flex items-center text-xs text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {getPermissionName(permissionId)}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      No specific permissions
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role.userCount} users assigned
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewRoleDetails(role.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{roles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Roles</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {roles.filter(role => role.isSystem).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permissions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {permissions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit log link */}
      <div className="flex justify-end mb-2 mt-4">
        <a href="/super-admin/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>
    </div>
  );
};

export default RoleManagement; 