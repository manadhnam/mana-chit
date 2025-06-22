import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChitGroup } from '@/types/index';

// Mock data
const mockChitGroups: ChitGroup[] = [
  {
    id: '1',
    name: 'Monthly Savings Group',
    amount: 10000,
    duration: 12,
    status: 'active',
    members: [
      {
        userId: '1',
        userName: 'John Doe',
        joinedAt: '2024-01-01',
      },
      {
        userId: '2',
        userName: 'Jane Smith',
        joinedAt: '2024-01-01',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-03-01',
  },
  {
    id: '2',
    name: 'Quarterly Investment Group',
    amount: 50000,
    duration: 24,
    status: 'active',
    members: [
      {
        userId: '1',
        userName: 'John Doe',
        joinedAt: '2024-02-01',
      },
      {
        userId: '3',
        userName: 'Bob Johnson',
        joinedAt: '2024-02-01',
      },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-03-01',
  },
];

interface ChitState {
  chitGroups: ChitGroup[];
  userChitGroups: ChitGroup[];
  contributions: Array<{
    id: string;
    amount: number;
    date: string;
    chitGroupId: string;
    chitGroupName: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  isLoading: boolean;
  error: string | null;
  fetchChitGroups: () => Promise<void>;
  fetchUserChitGroups: (userId: string) => Promise<void>;
  fetchContributions: (userId: string) => Promise<void>;
  joinChitGroup: (userId: string, groupId: string) => Promise<void>;
  createChitGroup: (data: Partial<ChitGroup>) => Promise<void>;
  updateChitGroup: (id: string, data: Partial<ChitGroup>) => Promise<void>;
  deleteChitGroup: (id: string) => Promise<void>;
  addMember: (chitGroupId: string, userId: string, userName: string) => Promise<void>;
  removeMember: (chitGroupId: string, userId: string) => Promise<void>;
  getChitGroupSummary: (chitGroupId: string) => Promise<{
    totalMembers: number;
    totalAmount: number;
    remainingDuration: number;
    nextDrawDate?: string;
  }>;
}

export const useChitStore = create<ChitState>()(
  persist(
    (set) => ({
      chitGroups: [],
      userChitGroups: [],
      contributions: [],
      isLoading: false,
      error: null,

      fetchChitGroups: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set({
            chitGroups: mockChitGroups,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      fetchUserChitGroups: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Filter chit groups for the user
          const mockUserChitGroups = mockChitGroups.filter((group: ChitGroup) => 
            group.members.some((member: { userId: string }) => member.userId === userId)
          );

          set({
            userChitGroups: mockUserChitGroups,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      fetchContributions: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock data
          const mockContributions = [
            {
              id: '1',
              amount: 5000,
              date: '2024-01-15',
              chitGroupId: '1',
              chitGroupName: 'Gold Savings',
              status: 'completed' as const
            },
            {
              id: '2',
              amount: 5000,
              date: '2024-02-15',
              chitGroupId: '1',
              chitGroupName: 'Gold Savings',
              status: 'completed' as const
            }
          ];

          set({
            contributions: mockContributions,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      joinChitGroup: async (userId: string, groupId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Add user to the chit group
          set((state) => ({
            chitGroups: state.chitGroups.map((group) =>
              group.id === groupId
                ? {
                    ...group,
                    members: [
                      ...group.members,
                      {
                        userId,
                        userName: 'New Member', // In a real app, this would come from user data
                        joinedAt: new Date().toISOString(),
                      },
                    ],
                    updatedAt: new Date().toISOString(),
                  }
                : group
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      createChitGroup: async (data: Partial<ChitGroup>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newChitGroup: ChitGroup = {
            id: String(Date.now()),
            name: data.name || '',
            amount: data.amount || 0,
            duration: data.duration || 12,
            status: 'active',
            members: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            chitGroups: [...state.chitGroups, newChitGroup],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      updateChitGroup: async (id: string, data: Partial<ChitGroup>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            chitGroups: state.chitGroups.map((chitGroup) =>
              chitGroup.id === id
                ? {
                    ...chitGroup,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  }
                : chitGroup
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      deleteChitGroup: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            chitGroups: state.chitGroups.filter((chitGroup) => chitGroup.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      addMember: async (chitGroupId: string, userId: string, userName: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            chitGroups: state.chitGroups.map((chitGroup) =>
              chitGroup.id === chitGroupId
                ? {
                    ...chitGroup,
                    members: [
                      ...chitGroup.members,
                      {
                        userId,
                        userName,
                        joinedAt: new Date().toISOString(),
                      },
                    ],
                    updatedAt: new Date().toISOString(),
                  }
                : chitGroup
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      removeMember: async (chitGroupId: string, userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            chitGroups: state.chitGroups.map((chitGroup) =>
              chitGroup.id === chitGroupId
                ? {
                    ...chitGroup,
                    members: chitGroup.members.filter(
                      (member) => member.userId !== userId
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : chitGroup
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      getChitGroupSummary: async (chitGroupId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock data
          const summary = {
            totalMembers: 10,
            totalAmount: 100000,
            remainingDuration: 9,
            nextDrawDate: '2024-04-01',
          };

          set({ isLoading: false });
          return summary;
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
      name: 'chit-storage'
    }
  )
);