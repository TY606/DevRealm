import { create } from 'zustand';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
  users: User[];
  loading: boolean;
  initUsers: () => void;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => User;
  updateUser: (id: string, updates: Partial<User>) => User | undefined;
  deleteUser: (id: string) => boolean;
  toggleBan: (id: string) => User | undefined;
  updateRole: (id: string, role: User['role']) => User | undefined;
  searchUsers: (query: string) => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,

  initUsers: () => {
    const storedUsers = localStorage.getItem('devrealm_users');
    if (storedUsers) {
      set({ users: JSON.parse(storedUsers) });
    } else {
      const defaultUsers: User[] = [
        {
          id: uuidv4(),
          email: 'admin@devrealm.com',
          username: 'admin',
          password: 'admin123',
          bio: '系统管理员',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 9999,
          level: 99,
          is_banned: false,
        },
        {
          id: uuidv4(),
          email: 'user@devrealm.com',
          username: 'developer',
          password: 'user123',
          bio: '游戏开发者',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 100,
          level: 5,
          is_banned: false,
        },
        {
          id: uuidv4(),
          email: 'vip@devrealm.com',
          username: 'vip_user',
          password: 'vip123',
          bio: 'VIP会员',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vip_user',
          role: 'vip',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 500,
          level: 10,
          is_banned: false,
        },
        {
          id: uuidv4(),
          email: 'expert@devrealm.com',
          username: 'game_expert',
          password: 'expert123',
          bio: '游戏开发专家',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game_expert',
          role: 'expert',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 1000,
          level: 15,
          is_banned: false,
        },
      ];
      localStorage.setItem('devrealm_users', JSON.stringify(defaultUsers));
      set({ users: defaultUsers });
    }
  },

  getAllUsers: () => {
    return get().users;
  },

  getUserById: (id) => {
    return get().users.find((u) => u.id === id);
  },

  createUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const users = [...get().users, newUser];
    localStorage.setItem('devrealm_users', JSON.stringify(users));
    set({ users });
    return newUser;
  },

  updateUser: (id, updates) => {
    const users = get().users.map((u) =>
      u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u
    );
    localStorage.setItem('devrealm_users', JSON.stringify(users));
    set({ users });
    return users.find((u) => u.id === id);
  },

  deleteUser: (id) => {
    const users = get().users.filter((u) => u.id !== id);
    localStorage.setItem('devrealm_users', JSON.stringify(users));
    set({ users });
    return true;
  },

  toggleBan: (id) => {
    const users = get().users.map((u) =>
      u.id === id ? { ...u, is_banned: !u.is_banned, updated_at: new Date().toISOString() } : u
    );
    localStorage.setItem('devrealm_users', JSON.stringify(users));
    set({ users });
    return users.find((u) => u.id === id);
  },

  updateRole: (id, role) => {
    const users = get().users.map((u) =>
      u.id === id ? { ...u, role, updated_at: new Date().toISOString() } : u
    );
    localStorage.setItem('devrealm_users', JSON.stringify(users));
    set({ users });
    return users.find((u) => u.id === id);
  },

  searchUsers: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().users.filter(
      (u) =>
        u.username.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
  },
}));