export interface DataRecord {
  id: number;
  name: string;
  email: string;
  company: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending' | 'Suspended';
  country: string;
  createdAt: string;
  score: number;
}