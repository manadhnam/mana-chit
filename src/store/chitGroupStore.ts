import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  joinDate: string;
  status: 'active' | 'inactive';
  contributions: Contribution[];
}

interface Contribution {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ChitGroup {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  memberCount: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  monthlyContribution: number;
  members: Member[];
  currentRound: number;
  totalRounds: number;
  nextDrawDate?: string;
  branch: string;
  manager: string;
}

interface ChitGroupState {
  userGroups: ChitGroup[];
  isLoading: boolean;
  fetchUserGroups: (userId: string) => Promise<void>;
  createGroup: (groupData: Partial<ChitGroup>) => Promise<void>;
  joinGroup: (groupId: string, userId: string) => Promise<void>;
  addContribution: (groupId: string, userId: string, amount: number) => Promise<void>;
}

// Mock chit group data for testing
const mockGroups: ChitGroup[] = [
  {
    id: '1',
    name: 'Monthly Savings Group',
    description: 'A group for monthly savings and investments',
    totalAmount: 100000,
    memberCount: 10,
    duration: 12,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    monthlyContribution: 10000,
    members: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'admin',
        joinDate: '2024-01-01',
        status: 'active',
        contributions: [
          {
            id: '1',
            amount: 10000,
            date: '2024-01-01',
            status: 'completed'
          },
          {
            id: '2',
            amount: 10000,
            date: '2024-02-01',
            status: 'completed'
          },
          {
            id: '3',
            amount: 10000,
            date: '2024-03-01',
            status: 'completed'
          }
        ]
      }
    ],
    currentRound: 3,
    totalRounds: 12,
    nextDrawDate: '2024-04-01',
    branch: 'Main Branch',
    manager: 'Jane Smith'
  }
];

export const useChitGroupStore = create<ChitGroupState>((set) => ({
  userGroups: [],
  isLoading: false,

  fetchUserGroups: async (userId: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would fetch from backend
      set({ userGroups: mockGroups, isLoading: false });
    } catch (error) {
      console.error('Error fetching chit groups:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  createGroup: async (groupData: Partial<ChitGroup>) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const newGroup: ChitGroup = {
        id: (mockGroups.length + 1).toString(),
        name: groupData.name || '',
        description: groupData.description || '',
        totalAmount: groupData.totalAmount || 0,
        memberCount: 1,
        duration: groupData.duration || 12,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (groupData.duration || 12) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        monthlyContribution: groupData.monthlyContribution || 0,
        members: [],
        currentRound: 0,
        totalRounds: groupData.duration || 12,
        branch: groupData.branch || '',
        manager: groupData.manager || ''
      };
      set({ userGroups: [...mockGroups, newGroup], isLoading: false });
    } catch (error) {
      console.error('Error creating chit group:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  joinGroup: async (groupId: string, userId: string) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedGroups = mockGroups.map(group => {
        if (group.id === groupId) {
          const newMember: Member = {
            id: userId,
            name: 'New Member',
            email: 'newmember@example.com',
            phone: '+1234567890',
            role: 'member',
            joinDate: new Date().toISOString(),
            status: 'active',
            contributions: []
          };
          return {
            ...group,
            members: [...group.members, newMember],
            memberCount: group.memberCount + 1
          };
        }
        return group;
      });
      set({ userGroups: updatedGroups, isLoading: false });
    } catch (error) {
      console.error('Error joining chit group:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  addContribution: async (groupId: string, userId: string, amount: number) => {
    try {
      set({ isLoading: true });
      // Mock API call - in real app, this would send to backend
      const updatedGroups = mockGroups.map(group => {
        if (group.id === groupId) {
          const updatedMembers = group.members.map(member => {
            if (member.id === userId) {
              const newContribution: Contribution = {
                id: (member.contributions.length + 1).toString(),
                amount,
                date: new Date().toISOString(),
                status: 'completed'
              };
              return {
                ...member,
                contributions: [...member.contributions, newContribution]
              };
            }
            return member;
          });
          return {
            ...group,
            members: updatedMembers
          };
        }
        return group;
      });
      set({ userGroups: updatedGroups, isLoading: false });
    } catch (error) {
      console.error('Error adding contribution:', error);
      set({ isLoading: false });
      throw error;
    }
  }
})); 