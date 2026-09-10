import { User, Role, UserStatus } from '../types/auth';
import { getStoredUsers, saveStoredUsers } from './authService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'MANAGER' | 'STAFF';
  status: UserStatus;
  title?: string;
  phone?: string;
  temporaryPassword?: string;
}

export interface AdminStats {
  totalManagers: number;
  totalStaff: number;
  activeUsers: number;
  recentlyCreated: User[];
}

export const adminService = {
  async getUsers(): Promise<User[]> {
    await delay(200);
    return getStoredUsers();
  },

  async createUser(input: CreateUserInput): Promise<User> {
    await delay(400);
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
      throw new Error(`An account with email "${input.email}" already exists.`);
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      status: input.status,
      title: input.title?.trim() || (input.role === 'MANAGER' ? 'Sales Manager' : 'Account Representative'),
      phone: input.phone?.trim() || '+1 (555) 000-0000',
      createdAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
      assignedLeadsCount: 0,
      conversionRate: 0
    };

    const updated = [newUser, ...users];
    saveStoredUsers(updated);
    return newUser;
  },

  async deleteUser(userId: string): Promise<void> {
    await delay(300);
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    
    if (!target) {
      throw new Error('User not found.');
    }

    if (target.role === 'ADMIN') {
      throw new Error('Cannot delete system Administrator accounts.');
    }

    const filtered = users.filter(u => u.id !== userId);
    saveStoredUsers(filtered);
  },

  async getAdminStats(): Promise<AdminStats> {
    await delay(150);
    const users = getStoredUsers();
    
    const managers = users.filter(u => u.role === 'MANAGER');
    const staff = users.filter(u => u.role === 'STAFF');
    const active = users.filter(u => u.status === 'Active');
    
    // Sort recently created
    const sorted = [...users].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      totalManagers: managers.length,
      totalStaff: staff.length,
      activeUsers: active.length,
      recentlyCreated: sorted.slice(0, 5)
    };
  }
};
