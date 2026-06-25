import { create } from 'zustand';
import { Badge, Achievement, User } from '@/types';

interface ProfileState {
  user: User | null;
  badges: Badge[];
  achievements: Achievement[];
  loading: boolean;
  setUser: (user: User | null) => void;
  setBadges: (badges: Badge[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setLoading: (loading: boolean) => void;
  addBadge: (badge: Badge) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  badges: [],
  achievements: [],
  loading: false,
  setUser: (user) => set({ user }),
  setBadges: (badges) => set({ badges }),
  setAchievements: (achievements) => set({ achievements }),
  setLoading: (loading) => set({ loading }),
  addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
  updateAchievementProgress: (achievementId, progress) => set((state) => ({
    achievements: state.achievements.map((ach) =>
      ach.id === achievementId
        ? { ...ach, progress, completed: progress >= ach.target }
        : ach
    ),
  })),
}));