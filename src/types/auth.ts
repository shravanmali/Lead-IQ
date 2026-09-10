export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
  phone?: string;
  title?: string;
  assignedLeadsCount?: number;
  conversionRate?: number;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}
