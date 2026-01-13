export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'pro' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  signupDate: Date;
  lastActive: Date;
  totalSessions: number;
  apiUsage: number;
}

export interface ModelStats {
  id: string;
  name: string;
  provider: string;
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  popularityShare: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface SystemStats {
  totalUsers: number;
  totalSessions: number;
  activeModels: number;
  apiCosts: number;
  userGrowth: number;
  sessionGrowth: number;
  modelGrowth: number;
  costGrowth: number;
}

export interface ActivityLog {
  id: string;
  type: 'user_signup' | 'api_warning' | 'model_update' | 'config_change' | 'system_health';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}