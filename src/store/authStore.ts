import { create } from 'zustand';
import { User, Role } from '@/types';

interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'guest',
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({
    user,
    role: user.role,
    token,
    isAuthenticated: true,
  }),
  logout: () => {
    localStorage.removeItem('devrealm_user');
    localStorage.removeItem('devrealm_token');
    set({
      user: null,
      role: 'guest',
      token: null,
      isAuthenticated: false,
    });
  },
  updateUser: (updatedUser) => set((state) => ({
    user: state.user ? { ...state.user, ...updatedUser } : null,
  })),
}));