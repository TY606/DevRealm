import { create } from 'zustand';
import { Post, Comment, Category } from '@/types';

interface ForumState {
  posts: Post[];
  comments: Comment[];
  categories: Category[];
  selectedPost: Post | null;
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  setComments: (comments: Comment[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  addPost: (post: Post) => void;
  addComment: (comment: Comment) => void;
  updatePostLikes: (postId: string, likes: number) => void;
}

export const useForumStore = create<ForumState>((set) => ({
  posts: [],
  comments: [],
  categories: [],
  selectedPost: null,
  loading: false,
  setPosts: (posts) => set({ posts }),
  setComments: (comments) => set({ comments }),
  setCategories: (categories) => set({ categories }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  setLoading: (loading) => set({ loading }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  updatePostLikes: (postId, likes) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, likes } : post
    ),
  })),
}));