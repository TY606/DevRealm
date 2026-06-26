import { create } from 'zustand';
import { Post, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface PostState {
  posts: Post[];
  loading: boolean;
  initPosts: () => void;
  getAllPosts: () => Post[];
  getPostById: (id: string) => Post | undefined;
  createPost: (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes' | 'comments_count'>) => Post;
  updatePost: (id: string, updates: Partial<Post>) => Post | undefined;
  deletePost: (id: string) => boolean;
  updateStatus: (id: string, status: Post['status']) => Post | undefined;
  searchPosts: (query: string) => Post[];
  filterByStatus: (status: Post['status'] | '') => Post[];
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: false,

  initPosts: () => {
    const storedPosts = localStorage.getItem('devrealm_posts');
    if (storedPosts) {
      set({ posts: JSON.parse(storedPosts) });
    } else {
      const users = JSON.parse(localStorage.getItem('devrealm_users') || '[]');
      const defaultPosts: Post[] = [
        {
          id: uuidv4(),
          user_id: users[0]?.id || uuidv4(),
          title: 'Unity 3D 新手入门指南',
          content: '本文介绍了 Unity 3D 引擎的基本概念和使用方法，适合刚接触游戏开发的新手。包括场景搭建、脚本编写、资源管理等内容。',
          category: '教程',
          tags: ['Unity', '新手', '教程'],
          likes: 128,
          comments_count: 24,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: 'published',
        },
        {
          id: uuidv4(),
          user_id: users[1]?.id || uuidv4(),
          title: '如何优化移动端游戏性能',
          content: '移动端游戏性能优化是一个重要课题。本文分享了一些实用的优化技巧，包括纹理压缩、对象池技术、渲染优化等。',
          category: '技术',
          tags: ['性能优化', '移动端', '游戏开发'],
          likes: 89,
          comments_count: 15,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'published',
        },
        {
          id: uuidv4(),
          user_id: users[2]?.id || uuidv4(),
          title: '独立游戏开发心得分享',
          content: '作为一名独立开发者，我想分享一下我的开发经验和心得。从创意构思到发布上线，每一步都充满挑战但也收获满满。',
          category: '经验',
          tags: ['独立游戏', '开发心得', '创业'],
          likes: 256,
          comments_count: 42,
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: 'published',
        },
        {
          id: uuidv4(),
          user_id: users[3]?.id || uuidv4(),
          title: 'AI 在游戏开发中的应用',
          content: '人工智能技术正在改变游戏开发的方式。本文探讨了 AI 在 NPC 行为、关卡生成、内容创作等方面的应用。',
          category: '技术',
          tags: ['AI', '人工智能', '游戏开发'],
          likes: 167,
          comments_count: 33,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'pending',
        },
        {
          id: uuidv4(),
          user_id: users[0]?.id || uuidv4(),
          title: '游戏音效设计技巧',
          content: '好的音效设计能大大提升游戏体验。本文介绍了音效设计的基本原则和常用工具。',
          category: '教程',
          tags: ['音效', '音频', '游戏设计'],
          likes: 56,
          comments_count: 8,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
        },
      ];
      localStorage.setItem('devrealm_posts', JSON.stringify(defaultPosts));
      set({ posts: defaultPosts });
    }
  },

  getAllPosts: () => {
    return get().posts;
  },

  getPostById: (id) => {
    return get().posts.find((p) => p.id === id);
  },

  createPost: (postData) => {
    const newPost: Post = {
      ...postData,
      id: uuidv4(),
      likes: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const posts = [...get().posts, newPost];
    localStorage.setItem('devrealm_posts', JSON.stringify(posts));
    set({ posts });
    return newPost;
  },

  updatePost: (id, updates) => {
    const posts = get().posts.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    localStorage.setItem('devrealm_posts', JSON.stringify(posts));
    set({ posts });
    return posts.find((p) => p.id === id);
  },

  deletePost: (id) => {
    const posts = get().posts.filter((p) => p.id !== id);
    localStorage.setItem('devrealm_posts', JSON.stringify(posts));
    set({ posts });
    return true;
  },

  updateStatus: (id, status) => {
    const posts = get().posts.map((p) =>
      p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p
    );
    localStorage.setItem('devrealm_posts', JSON.stringify(posts));
    set({ posts });
    return posts.find((p) => p.id === id);
  },

  searchPosts: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().posts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.content.toLowerCase().includes(lowerQuery)
    );
  },

  filterByStatus: (status) => {
    if (!status) return get().posts;
    return get().posts.filter((p) => p.status === status);
  },
}));