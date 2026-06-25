export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  role: 'user' | 'vip' | 'admin' | 'expert';
  created_at: string;
  updated_at: string;
  reputation: number;
  level: number;
  is_banned?: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
  status?: 'published' | 'pending' | 'hidden';
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  likes: number;
  created_at: string;
  user?: User;
  replies?: Comment[];
}

export interface Game {
  id: string;
  user_id: string;
  name: string;
  title?: string;
  description: string;
  category: string;
  genre?: string;
  cover_url?: string;
  cover_image?: string;
  developer?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'live' | 'published';
  created_at: string;
  updated_at?: string;
  published_at?: string;
  user?: User;
  downloads?: number | string;
  rating?: number | string;
}

export interface Channel {
  id: string;
  game_id?: string;
  platform?: string;
  status?: string;
  synced_at?: string;
  name: string;
  description: string;
  color: string;
}

export interface Contract {
  id: string;
  game_id?: string;
  type?: 'revenue_share' | 'exclusive' | 'free';
  terms?: Record<string, unknown>;
  signed?: boolean;
  signed_at?: string;
  title: string;
  status: 'pending' | 'signed' | 'expired';
  channel_name: string;
  valid_until: string;
  revenue_share: number;
}

export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_at?: string;
}

export interface Expert {
  id: string;
  user_id: string;
  specialization: string;
  bio: string;
  rating: number;
  joined_at: string;
  user?: User;
}

export interface Consultation {
  id: string;
  user_id: string;
  expert_id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  created_at: string;
  answered_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface Platform {
  id: string;
  name: string;
  logo: string;
  description: string;
  supported: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'approval' | 'system';
  message: string;
  read: boolean;
  created_at: string;
}

export type Role = 'guest' | 'user' | 'vip' | 'admin';