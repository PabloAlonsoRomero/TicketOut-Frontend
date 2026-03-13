import { Role } from '../utils/ticket-enums';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* AUTH */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
}
