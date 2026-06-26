import { create } from 'zustand';
import { Game } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface GameState {
  games: Game[];
  loading: boolean;
  initGames: () => void;
  getAllGames: () => Game[];
  getGameById: (id: string) => Game | undefined;
  createGame: (gameData: Omit<Game, 'id' | 'created_at' | 'updated_at' | 'published_at'>) => Game;
  updateGame: (id: string, updates: Partial<Game>) => Game | undefined;
  deleteGame: (id: string) => boolean;
  updateStatus: (id: string, status: Game['status']) => Game | undefined;
  searchGames: (query: string) => Game[];
  filterByStatus: (status: Game['status'] | '') => Game[];
}

export const useGameStore = create<GameState>((set, get) => ({
  games: [],
  loading: false,

  initGames: () => {
    const storedGames = localStorage.getItem('devrealm_games');
    if (storedGames) {
      set({ games: JSON.parse(storedGames) });
    } else {
      const users = JSON.parse(localStorage.getItem('devrealm_users') || '[]');
      const defaultGames: Game[] = [
        {
          id: uuidv4(),
          user_id: users[0]?.id || uuidv4(),
          name: 'Space Adventure',
          title: '太空冒险',
          description: '一款科幻题材的太空射击游戏，玩家需要驾驶飞船穿越银河系，击败外星敌人。',
          category: '射击',
          genre: 'Action',
          cover_image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=space%20shooter%20game%20cover%20art%20sci-fi%20spaceship%20galaxy&image_size=landscape_16_9',
          developer: 'Star Studios',
          status: 'live',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
          published_at: new Date(Date.now() - 86400000 * 25).toISOString(),
          downloads: 15000,
          rating: 4.5,
        },
        {
          id: uuidv4(),
          user_id: users[1]?.id || uuidv4(),
          name: 'Pixel Hero',
          title: '像素英雄',
          description: '复古像素风格的RPG游戏，玩家扮演勇者拯救被魔王占领的王国。',
          category: '角色扮演',
          genre: 'RPG',
          cover_image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pixel%20art%20RPG%20game%20cover%20retro%20hero%20fantasy&image_size=landscape_16_9',
          developer: 'Pixel Dream',
          status: 'approved',
          created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          published_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          downloads: 8500,
          rating: 4.3,
        },
        {
          id: uuidv4(),
          user_id: users[2]?.id || uuidv4(),
          name: 'City Builder',
          title: '城市建造者',
          description: '一款模拟经营类游戏，玩家需要规划和建设自己的城市，满足居民的需求。',
          category: '模拟',
          genre: 'Simulation',
          cover_image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=city%20building%20simulation%20game%20cover%20modern%20cityscape&image_size=landscape_16_9',
          developer: 'Urban Games',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          downloads: 0,
          rating: 0,
        },
        {
          id: uuidv4(),
          user_id: users[3]?.id || uuidv4(),
          name: 'Racing Master',
          title: '赛车大师',
          description: '极速赛车游戏，多种赛道和车型选择，体验速度与激情。',
          category: '竞速',
          genre: 'Racing',
          cover_image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=racing%20game%20cover%20sports%20car%20speed%20track&image_size=landscape_16_9',
          developer: 'Speed Works',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          downloads: 0,
          rating: 0,
        },
        {
          id: uuidv4(),
          user_id: users[0]?.id || uuidv4(),
          name: 'Match Puzzle',
          title: '消除谜题',
          description: '经典三消游戏，精美的画面和丰富的关卡设计。',
          category: '休闲',
          genre: 'Puzzle',
          cover_image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=puzzle%20match%20three%20game%20cover%20colorful%20gemstones&image_size=landscape_16_9',
          developer: 'Fun Games',
          status: 'rejected',
          created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
          downloads: 0,
          rating: 0,
        },
      ];
      localStorage.setItem('devrealm_games', JSON.stringify(defaultGames));
      set({ games: defaultGames });
    }
  },

  getAllGames: () => {
    return get().games;
  },

  getGameById: (id) => {
    return get().games.find((g) => g.id === id);
  },

  createGame: (gameData) => {
    const newGame: Game = {
      ...gameData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      downloads: 0,
      rating: 0,
    };
    const games = [...get().games, newGame];
    localStorage.setItem('devrealm_games', JSON.stringify(games));
    set({ games });
    return newGame;
  },

  updateGame: (id, updates) => {
    const games = get().games.map((g) =>
      g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
    );
    localStorage.setItem('devrealm_games', JSON.stringify(games));
    set({ games });
    return games.find((g) => g.id === id);
  },

  deleteGame: (id) => {
    const games = get().games.filter((g) => g.id !== id);
    localStorage.setItem('devrealm_games', JSON.stringify(games));
    set({ games });
    return true;
  },

  updateStatus: (id, status) => {
    const games = get().games.map((g) => {
      if (g.id === id) {
        const updated = {
          ...g,
          status,
          updated_at: new Date().toISOString(),
        };
        if (status === 'approved' || status === 'live') {
          updated.published_at = updated.published_at || new Date().toISOString();
        }
        return updated;
      }
      return g;
    });
    localStorage.setItem('devrealm_games', JSON.stringify(games));
    set({ games });
    return games.find((g) => g.id === id);
  },

  searchGames: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().games.filter(
      (g) =>
        (g.title || g.name).toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery) ||
        g.developer?.toLowerCase().includes(lowerQuery)
    );
  },

  filterByStatus: (status) => {
    if (!status) return get().games;
    if (status === 'published') {
      return get().games.filter((g) => g.status === 'live' || g.status === 'approved');
    }
    return get().games.filter((g) => g.status === status);
  },
}));