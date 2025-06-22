import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type UserRole = 'superAdmin' | 'departmentHead' | 'mandalHead' | 'branchManager' | 'agent' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  mobile?: string;
  walletBalance?: number;
  profilePic?: string;
  branch?: string;
  address?: string;
  dateOfBirth?: string;
  aadhaarVerified?: boolean;
  panVerified?: boolean;
  idProof?: {
    type: string;
    verified: boolean;
    file: string;
  };
  branchId?: string;
  kyc_status?: 'pending' | 'submitted' | 'verified' | 'rejected';
  kyc_documents?: {
    pan_url?: string;
    aadhaar_url?: string;
  };
}

// Mock user data for testing different roles
const mockUsers: Record<string, User> = {
  'superAdmin': {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    email: 'admin@example.com',
    name: 'Super Admin',
    role: 'superAdmin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    mobile: '9999999999',
    walletBalance: 100000,
  },
  'departmentHead': {
    id: '2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee',
    email: 'dept@example.com',
    name: 'Department Head',
    role: 'departmentHead',
    avatar: 'https://i.pravatar.cc/150?img=2',
    mobile: '8888888888',
    walletBalance: 75000,
  },
  'mandalHead': {
    id: '3b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bef',
    email: 'mandal@example.com',
    name: 'Mandal Head',
    role: 'mandalHead',
    avatar: 'https://i.pravatar.cc/150?img=3',
    mobile: '7777777777',
    walletBalance: 50000,
  },
  'branchManager': {
    id: '4b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf0',
    email: 'branch@example.com',
    name: 'Branch Manager',
    role: 'branchManager',
    avatar: 'https://i.pravatar.cc/150?img=4',
    mobile: '6666666666',
    walletBalance: 25000,
    branchId: 'branch-1-uuid',
  },
  'agent': {
    id: '5b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf1',
    email: 'agent@example.com',
    name: 'Agent User',
    role: 'agent',
    avatar: 'https://i.pravatar.cc/150?img=5',
    mobile: '5555555555',
    walletBalance: 10000,
    branchId: 'branch-1-uuid',
  },
  'user': {
    id: '6b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=6',
    mobile: '4444444444',
    walletBalance: 5000,
  },
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: UserRole | null;
  intendedPath: string | null;
  login: (mobile: string, otp: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setIntendedPath: (path: string) => void;
  getDefaultRoute: (role: UserRole) => string;
}

// Create the store
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userRole: null,
      intendedPath: null,

      setIntendedPath: (path: string) => {
        set({ intendedPath: path });
      },

      getDefaultRoute: (role: UserRole) => {
        switch (role) {
          case 'superAdmin':
            return '/super-admin/dashboard';
          case 'departmentHead':
            return '/department-head/dashboard';
          case 'mandalHead':
            return '/mandal-head/dashboard';
          case 'branchManager':
            return '/branch-manager/dashboard';
          case 'agent':
            return '/agent/dashboard';
          case 'user':
            return '/customer/dashboard';
          default:
            return '/unauthorized';
        }
      },

      login: async (mobile: string, otp: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock OTP verification
          if (otp !== '123456') {
            throw new Error('Invalid OTP');
          }

          // Get mock user data based on role
          const user = mockUsers[role];
          if (!user) {
            throw new Error('Invalid role');
          }

          set({
            user,
            userRole: user.role,
            isAuthenticated: true,
            isLoading: false,
          });

          // Redirect to intended path or default route
          const intendedPath = get().intendedPath;
          if (intendedPath) {
            window.location.href = intendedPath;
          } else {
            window.location.href = get().getDefaultRoute(user.role);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          userRole: null,
          isAuthenticated: false,
          error: null,
          intendedPath: null,
        });
        window.location.href = '/auth/login';
      },

      register: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: String(Date.now()),
            email: userData.email || '',
            name: userData.name || '',
            role: userData.role || 'user',
            mobile: userData.mobile,
            avatar: `https://i.pravatar.cc/150?img=${Date.now()}`,
            walletBalance: 0,
          };

          set({
            user: newUser,
            userRole: newUser.role,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      checkAuth: () => {
        set({ isLoading: true });
        try {
          // Mock API call to check session
          const storedUser = localStorage.getItem('auth-storage');
          if (storedUser) {
            const { state } = JSON.parse(storedUser);
            if (state.user) {
              set({
                user: state.user,
                userRole: state.user.role,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }
          set({ isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to check authentication',
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { useAuthStore };