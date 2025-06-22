import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'group' | 'loan' | 'wallet' | 'settings' | 'system';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoleState {
  roles: Role[];
  permissions: Permission[];
  isLoading: boolean;
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  assignPermissions: (roleId: string, permissionIds: string[]) => Promise<void>;
}

// Mock permissions data for testing
const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'view_users',
    description: 'Can view user profiles and details',
    category: 'user'
  },
  {
    id: '2',
    name: 'manage_users',
    description: 'Can create, update, and delete users',
    category: 'user'
  },
  {
    id: '3',
    name: 'view_groups',
    description: 'Can view chit groups and their details',
    category: 'group'
  },
  {
    id: '4',
    name: 'manage_groups',
    description: 'Can create, update, and delete chit groups',
    category: 'group'
  },
  {
    id: '5',
    name: 'view_loans',
    description: 'Can view loan applications and details',
    category: 'loan'
  },
  {
    id: '6',
    name: 'manage_loans',
    description: 'Can approve, reject, and manage loans',
    category: 'loan'
  },
  {
    id: '7',
    name: 'view_wallet',
    description: 'Can view wallet transactions and balance',
    category: 'wallet'
  },
  {
    id: '8',
    name: 'manage_wallet',
    description: 'Can manage wallet transactions and settings',
    category: 'wallet'
  }
];

// Mock roles data for testing
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: mockPermissions.map(p => p.id),
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Can manage users, groups, and loans',
    permissions: ['1', '2', '3', '4', '5', '6'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic user access',
    permissions: ['1', '3', '5', '7'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  permissions: [],
  isLoading: false,

  fetchRoles: async () => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ roles: mockRoles, isLoading: false });
    } catch (error) {
      console.error('Error fetching roles:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  fetchPermissions: async () => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ permissions: mockPermissions, isLoading: false });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  createRole: async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const newRole: Role = {
        id: (mockRoles.length + 1).toString(),
        ...role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      set({ roles: [...mockRoles, newRole], isLoading: false });
    } catch (error) {
      console.error('Error creating role:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRole: async (id: string, role: Partial<Role>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedRoles = mockRoles.map(r => {
        if (r.id === id) {
          return {
            ...r,
            ...role,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      });
      set({ roles: updatedRoles, isLoading: false });
    } catch (error) {
      console.error('Error updating role:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteRole: async (id: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedRoles = mockRoles.filter(r => r.id !== id);
      set({ roles: updatedRoles, isLoading: false });
    } catch (error) {
      console.error('Error deleting role:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  assignPermissions: async (roleId: string, permissionIds: string[]) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedRoles = mockRoles.map(r => {
        if (r.id === roleId) {
          return {
            ...r,
            permissions: permissionIds,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      });
      set({ roles: updatedRoles, isLoading: false });
    } catch (error) {
      console.error('Error assigning permissions:', error);
      set({ isLoading: false });
      throw error;
    }
  }
})); 