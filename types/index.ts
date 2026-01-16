export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  subscription?: 'free' | 'pro';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  role?: 'user' | 'admin';
}

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  description: string;
  capabilities: string[];
  speed: 'Fast' | 'Express' | 'Balanced' | 'Advanced' | 'Low Latency';
  pricing: 'Premium' | 'Cost-Effective' | 'Open Source';
  features: string[];
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelResponses?: {
    [modelId: string]: {
      content: string;
      timestamp: Date;
      likes: number;
      dislikes: number;
    };
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  selectedModels: string[];
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}