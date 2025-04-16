export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  ip_address: string;
  details: Record<string, any>;
  created_at: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
} 