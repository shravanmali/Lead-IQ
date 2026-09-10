import { User, LoginCredentials } from '../types/auth';
import { INITIAL_USERS } from './mockData';

const USERS_STORAGE_KEY = 'leadiq_users_in';
const SESSION_STORAGE_KEY = 'leadiq_session_in';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(350);
    const users = getStoredUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();
    
    // Auto-detect role by matching email (supports .in and .com)
    let user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // Fallback matching prefixes
      if (normalizedEmail.startsWith('admin@')) {
        user = users.find(u => u.role === 'ADMIN');
      } else if (normalizedEmail.startsWith('manager@')) {
        user = users.find(u => u.role === 'MANAGER');
      } else if (normalizedEmail.startsWith('staff@')) {
        user = users.find(u => u.role === 'STAFF');
      }
    }

    if (!user) {
      throw new Error(`No account found for "${credentials.email}". Use admin@leadiq.in, manager@leadiq.in, or staff@leadiq.in`);
    }

    if (user.status === 'Suspended') {
      throw new Error('This account has been suspended. Please contact your system administrator.');
    }

    // Save session
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await delay(150);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async switchRoleDemo(role: 'ADMIN' | 'MANAGER' | 'STAFF'): Promise<User> {
    await delay(150);
    const users = getStoredUsers();
    const target = users.find(u => u.role === role && u.status === 'Active') || users[0];
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(target));
    return target;
  }
};
