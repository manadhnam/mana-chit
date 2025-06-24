import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  User,
  Shield,
  Eye,
  Download,
  Snowflake,
  Sun,
  History,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { FreezeUserModal } from '@/components/common/FreezeUserModal';
import { FreezeLogsTable } from '@/components/common/FreezeLogsTable';
import { FreezeService } from '@/services/freezeService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { User as GlobalUser } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  department?: string;
  mandal?: string;
  branch?: string;
  isFrozen?: boolean;
  frozenAt?: string;
  frozenBy?: string;
  freezeReason?: string;
}

interface Department {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
  village: string;
  mandal: string;
  district: string;
}

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [freezeFilter, setFreezeFilter] = useState('all');
  
  // Freeze modal state
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [freezeAction, setFreezeAction] = useState<'freeze' | 'unfreeze'>('freeze');
  
  // Freeze logs modal state
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<User | null>(null);
  
  // Stats state
  const [frozenUsersCount, setFrozenUsersCount] = useState(0);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department_id: '',
    branch_id: '',
    status: 'active',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadFrozenUsersCount();
    fetchDeps();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, mobile, role, branch_id, status, updated_at, is_frozen, frozen_at, frozen_by, freeze_reason');
      if (error) {
        toast.error('Failed to fetch users!');
        return;
      }
      const users = (data || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.mobile,
        role: u.role,
        status: u.status,
        lastLogin: u.updated_at,
        branch: u.branch_id,
        isFrozen: u.is_frozen || false,
        frozenAt: u.frozen_at,
        frozenBy: u.frozen_by,
        freezeReason: u.freeze_reason,
      }));
      setUsers(users);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFrozenUsersCount = async () => {
    try {
      const count = await FreezeService.getFrozenUsersCount();
      setFrozenUsersCount(count);
    } catch (error) {
      console.error('Error loading frozen users count:', error);
    }
  };

  const fetchDeps = async () => {
    const { data: depData } = await supabase.from('departments').select('id, name');
    if (depData) setDepartments(depData);
    const { data: branchData } = await supabase.from('branches').select('id, name, village, mandal, district');
    if (branchData) setBranches(branchData);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesFreeze = freezeFilter === 'all' || 
      (freezeFilter === 'frozen' && user.isFrozen) ||
      (freezeFilter === 'active' && !user.isFrozen);
    
    return matchesSearch && matchesRole && matchesStatus && matchesFreeze;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'departmentHead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'mandalHead':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'branchManager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'agent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Frozen', 'Last Login'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.status,
        user.isFrozen ? 'Yes' : 'No',
        new Date(user.lastLogin).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('User data exported successfully!');
  };

  const handleViewUserDetails = (userId: string) => {
    // Navigate to user details view (read-only)
    window.open(`/super-admin/users/${userId}`, '_blank');
  };

  const handleFreezeUser = (user: User) => {
    setSelectedUser(user);
    setFreezeAction('freeze');
    setFreezeModalOpen(true);
  };

  const handleUnfreezeUser = (user: User) => {
    setSelectedUser(user);
    setFreezeAction('unfreeze');
    setFreezeModalOpen(true);
  };

  const handleViewFreezeLogs = (user: User) => {
    setSelectedUserForLogs(user);
    setLogsModalOpen(true);
  };

  const handleFreezeSuccess = () => {
    loadUsers();
    loadFrozenUsersCount();
    toast.success(`User successfully ${freezeAction}d!`);
  };

  const canFreezeUser = (user: User) => {
    // Super Admin can freeze anyone except themselves
    return user.role !== 'superAdmin' || user.id !== 'current-user-id'; // Replace with actual current user check
  };

  const canUnfreezeUser = (user: User) => {
    // Super Admin can unfreeze anyone
    return true;
  };

  const openCreateUser = () => {
    setEditUser(null);
    setForm({ name: '', email: '', phone: '', role: '', department_id: '', branch_id: '', status: 'active' });
    setUserModalOpen(true);
  };
  const openEditUser = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department_id: user.department || '',
      branch_id: user.branch || '',
      status: user.status,
    });
    setUserModalOpen(true);
  };
  const closeUserModal = () => {
    setUserModalOpen(false);
    setEditUser(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, role: value, department_id: '', branch_id: '' }));
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editUser) {
        // Edit user
        await supabase.from('users').update({
          name: form.name,
          email: form.email,
          mobile: form.phone,
          role: form.role,
          status: form.status,
          department_id: form.role === 'departmentHead' ? form.department_id : null,
          branch_id: form.role === 'branchManager' ? form.branch_id : null,
        }).eq('id', editUser.id);
        toast.success('User updated!');
      } else {
        // Create user
        await supabase.from('users').insert({
          name: form.name,
          email: form.email,
          mobile: form.phone,
          role: form.role,
          status: form.status,
          department_id: form.role === 'departmentHead' ? form.department_id : null,
          branch_id: form.role === 'branchManager' ? form.branch_id : null,
        });
        toast.success('User created!');
      }
      loadUsers();
      closeUserModal();
    } catch (err) {
      toast.error('Error saving user');
    } finally {
      setFormLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View system users and manage freeze status (Read-only access for user management)
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="superAdmin">Super Admin</option>
              <option value="departmentHead">Department Head</option>
              <option value="mandalHead">Mandal Head</option>
              <option value="branchManager">Branch Manager</option>
              <option value="agent">Agent</option>
              <option value="user">Customer</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={freezeFilter}
              onChange={(e) => setFreezeFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="frozen">Frozen Users</option>
            </select>
            <Snowflake className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Button onClick={openCreateUser}>+ Add User</Button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Freeze Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isFrozen ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Snowflake className="h-3 w-3" />
                        Frozen
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Sun className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.lastLogin).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewUserDetails(user.id)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleViewFreezeLogs(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Freeze History"
                      >
                        <History className="h-5 w-5" />
                      </button>

                      {user.isFrozen ? (
                        canUnfreezeUser(user) && (
                          <button
                            onClick={() => handleUnfreezeUser(user)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Unfreeze User"
                          >
                            <Sun className="h-5 w-5" />
                          </button>
                        )
                      ) : (
                        canFreezeUser(user) && (
                          <button
                            onClick={() => handleFreezeUser(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Freeze User"
                          >
                            <Snowflake className="h-5 w-5" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Snowflake className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Frozen Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {frozenUsersCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff Members</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(u => ['departmentHead', 'mandalHead', 'branchManager', 'agent'].includes(u.role)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Freeze User Modal */}
      <FreezeUserModal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        user={selectedUser}
        action={freezeAction}
        onSuccess={handleFreezeSuccess}
      />

      {/* Freeze Logs Modal */}
      <Dialog open={logsModalOpen} onOpenChange={setLogsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Freeze History - {selectedUserForLogs?.name}
            </DialogTitle>
          </DialogHeader>
          <FreezeLogsTable 
            userId={selectedUserForLogs?.id}
            showFilters={false}
          />
        </DialogContent>
      </Dialog>

      {/* Audit log link */}
      <div className="flex justify-end mb-2 mt-4">
        <a href="/super-admin/AuditLogs" className="text-primary-600 hover:underline text-sm">View Audit Logs</a>
      </div>

      <Dialog open={userModalOpen} onOpenChange={closeUserModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>
              {editUser ? 'Update user details.' : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserFormSubmit} className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input name="name" value={form.name} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleFormChange} required />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger><SelectValue placeholder="Assign a role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="departmentHead">Department Head</SelectItem>
                  <SelectItem value="mandalHead">Mandal Head</SelectItem>
                  <SelectItem value="branchManager">Branch Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="user">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === 'departmentHead' && (
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={form.department_id}
                  onValueChange={(value) => setForm(prev => ({ ...prev, department_id: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Assign a department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(dep => (
                      <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.role === 'branchManager' && (
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Select
                  value={form.branch_id}
                  onValueChange={(value) => setForm(prev => ({ ...prev, branch_id: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Assign a branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name} ({branch.village}, {branch.mandal}, {branch.district})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeUserModal}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save User'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 