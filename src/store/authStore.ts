import { create } from 'zustand';
import { persist, createJSONStorage } from '@zustand/middleware';
import { User, Role } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: 'guest',
      token: null,
      isAuthenticated: false,

      register: async (email, username, password) => {
        const existingUsers = JSON.parse(localStorage.getItem('devrealm_users') || '[]');
        
        if (existingUsers.some((u: User) => u.email === email)) {
          return { success: false, error: '该邮箱已被注册' };
        }
        
        if (existingUsers.some((u: User) => u.username === username)) {
          return { success: false, error: '该用户名已被使用' };
        }
        
        const newUser: User = {
          id: uuidv4(),
          email,
          username,
          password,
          bio: '',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 0,
          level: 1,
          is_banned: false,
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('devrealm_users', JSON.stringify(existingUsers));
        
        set({
          user: newUser,
          role: newUser.role,
          token: 'token-' + Date.now(),
          isAuthenticated: true,
        });
        
        return { success: true };
      },

      login: async (email, password) => {
        const users = JSON.parse(localStorage.getItem('devrealm_users') || '[]');
        const user = users.find((u: User) => u.email === email && u.password === password);
        
        if (!user) {
          return { success: false, error: '邮箱或密码错误' };
        }
        
        if (user.is_banned) {
          return { success: false, error: '该账号已被封禁' };
        }
        
        set({
          user,
          role: user.role,
          token: 'token-' + Date.now(),
          isAuthenticated: true,
        });
        
        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          role: 'guest',
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedUser) => {
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...updatedUser, updated_at: new Date().toISOString() };
          
          const users = JSON.parse(localStorage.getItem('devrealm_users') || '[]');
          const index = users.findIndex((u: User) => u.id === state.user!.id);
          if (index !== -1) {
            users[index] = updated;
            localStorage.setItem('devrealm_users', JSON.stringify(users));
          }
          
          return { user: updated };
        });
      },
    }),
    {
      name: 'devrealm-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);