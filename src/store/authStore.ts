import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { User as DBUser } from '@/types/database';

// Types
export type UserRole = 'superAdmin' | 'departmentHead' | 'mandalHead' | 'branchManager' | 'agent' | 'user';

export type User = DBUser;

// Example mock user data for testing different roles
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    mobile: '9999999999',
    role: 'superAdmin',
    status: 'active',
    branch_id: 'branch-1-uuid',
    mandal_id: undefined,
    department_id: undefined,
    id_proof_type: undefined,
    id_proof_file: undefined,
    id_proof_verified: false,
    wallet_balance: 0,
    referral_code: undefined,
    photo_url: 'https://i.pravatar.cc/150?img=1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ...add more mock users as needed, following the same structure
];

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
  setUser: (user: User | null) => void;
  clearUser: () => void;
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
          if (otp !== '123456') {
            throw new Error('Invalid OTP');
          }

          let user: User | null = null;

          // Check if it's a demo login
          const demoUser = mockUsers.find(u => u.mobile === mobile && u.role === role);

          if (demoUser) {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
            user = demoUser;
          } else {
            // It's a real login, fetch the user from the database
            const { data, error: rpcError } = await supabase
              .rpc('get_user_by_role_and_mobile', { p_role: role, p_mobile: mobile })
              .single();

            if (rpcError || !data) {
              throw new Error('Login failed. No user found with that role and mobile number.');
            }
            user = data as User;
          }
          
          if (!user) {
             throw new Error('Login failed. Could not retrieve user details.');
          }

          set({
            user: user,
            userRole: user.role,
            isAuthenticated: true,
            isLoading: false,
          });

          // Redirect to intended path or default route
          const intendedPath = get().intendedPath;
          if (intendedPath) {
            window.location.href = intendedPath;
            set({ intendedPath: null }); // Clear the intended path
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
            mobile: userData.mobile || '',
            status: 'active',
            wallet_balance: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id_proof_type: undefined,
            id_proof_file: undefined,
            id_proof_verified: false,
            mandal_id: undefined,
            department_id: undefined,
            referral_code: undefined,
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

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { useAuthStore };

