import { create } from 'zustand';
import { Game, Channel, Platform } from '@/types';

interface GameState {
  games: Game[];
  platforms: Platform[];
  selectedGame: Game | null;
  loading: boolean;
  setGames: (games: Game[]) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setSelectedGame: (game: Game | null) => void;
  setLoading: (loading: boolean) => void;
  addGame: (game: Game) => void;
  updateGameStatus: (gameId: string, status: Game['status']) => void;
  setChannels: (gameId: string, channels: Channel[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  games: [],
  platforms: [],
  selectedGame: null,
  loading: false,
  setGames: (games) => set({ games }),
  setPlatforms: (platforms) => set({ platforms }),
  setSelectedGame: (game) => set({ selectedGame: game }),
  setLoading: (loading) => set({ loading }),
  addGame: (game) => set((state) => ({ games: [game, ...state.games] })),
  updateGameStatus: (gameId, status) => set((state) => ({
    games: state.games.map((game) =>
      game.id === gameId ? { ...game, status } : game
    ),
  })),
  setChannels: () => set({}),
}));