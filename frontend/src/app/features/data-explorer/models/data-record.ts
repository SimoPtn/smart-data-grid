export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Pending' | 'Suspended';

export interface DataRecord {
  id: number;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  createdAt: string;
  score: number;
}