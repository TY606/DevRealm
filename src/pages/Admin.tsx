import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Gamepad2, Search, Filter, Check, X, Ban, Trash2, 
  Edit3, Clock, AlertCircle, Plus, UserPlus, Save, ChevronRight, Package, Mail,
  Lock, User, LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import { useGameStore } from '@/store/gameStore';
import { User as UserType, Post, Game } from '@/types';

type AdminTab = 'dashboard' | 'users' | 'posts' | 'games';

interface ModalState {
  type: 'create-user' | 'edit-user' | 'create-post' | 'edit-post' | 'create-game' | 'edit-game' | 'delete' | null;
  data?: UserType | Post | Game;
}

export default function Admin() {
  const { user, logout } = useAuthStore();
  const { users, initUsers, createUser, updateUser, deleteUser, toggleBan, updateRole, searchUsers } = useUserStore();
  const { posts, initPosts, createPost, updatePost, deletePost, updateStatus: updatePostStatus, searchPosts } = usePostStore();
  const { games, initGames, createGame, updateGame, deleteGame, updateStatus: updateGameStatus, searchGames } = useGameStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<ModalState>(null);
  const [formData, setFormData] = useState<Partial<UserType> & Partial<Post> & Partial<Game>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    initUsers();
    initPosts();
    initGames();
  }, []);

  useEffect(() => {
    if (modal?.type) {
      if (modal.type === 'create-user') {
        setFormData({ username: '', email: '', password: '', role: 'user', bio: '' });
      } else if (modal.type === 'edit-user' && modal.data) {
        const u = modal.data as UserType;
        setFormData({ ...u });
      } else if (modal.type === 'create-post') {
        setFormData({ title: '', content: '', category: '', tags: [] });
      } else if (modal.type === 'edit-post' && modal.data) {
        const p = modal.data as Post;
        setFormData({ ...p });
      } else if (modal.type === 'create-game') {
        setFormData({ name: '', title: '', description: '', category: '', genre: '', developer: '' });
      } else if (modal.type === 'edit-game' && modal.data) {
        const g = modal.data as Game;
        setFormData({ ...g });
      }
    }
  }, [modal]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-4">访问被拒绝</h2>
          <p className="text-gray-400">你没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  const filteredUsers = searchQuery ? searchUsers(searchQuery) : users;
  const filteredPosts = searchQuery ? searchPosts(searchQuery) : posts;
  const filteredGames = searchQuery ? searchGames(searchQuery) : games;

  const filteredUsersByStatus = filterStatus 
    ? filteredUsers.filter(u => filterStatus === 'banned' ? u.is_banned : !u.is_banned)
    : filteredUsers;

  const filteredPostsByStatus = filterStatus 
    ? filteredPosts.filter(p => p.status === filterStatus)
    : filteredPosts;

  const filteredGamesByStatus = filterStatus 
    ? filterStatus === 'published' 
      ? filteredGames.filter(g => g.status === 'live' || g.status === 'approved')
      : filteredGames.filter(g => g.status === filterStatus)
    : filteredGames;

  const stats = [
    { label: '总用户数', value: users.length.toString(), icon: Users, color: 'text-primary' },
    { label: '帖子总数', value: posts.length.toString(), icon: FileText, color: 'text-secondary' },
    { label: '已发布游戏', value: games.filter(g => g.status === 'live' || g.status === 'approved').length.toString(), icon: Gamepad2, color: 'text-accent' },
    { label: '待审核', value: [...posts, ...games].filter(item => item.status === 'pending').length.toString(), icon: Clock, color: 'text-yellow-400' },
  ];

  const handleSaveUser = () => {
    if (modal?.type === 'create-user') {
      createUser(formData as Omit<UserType, 'id' | 'created_at' | 'updated_at'>);
    } else if (modal?.type === 'edit-user' && modal.data) {
      updateUser((modal.data as UserType).id, formData);
    }
    setModal(null);
  };

  const handleSavePost = () => {
    const postData = formData as Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes' | 'comments_count'>;
    if (modal?.type === 'create-post') {
      createPost({ ...postData, user_id: user!.id, tags: (postData.tags as string[] || []), status: 'pending' });
    } else if (modal?.type === 'edit-post' && modal.data) {
      updatePost((modal.data as Post).id, formData);
    }
    setModal(null);
  };

  const handleSaveGame = () => {
    const gameData = formData as Omit<Game, 'id' | 'created_at' | 'updated_at' | 'published_at'>;
    if (modal?.type === 'create-game') {
      createGame({ ...gameData, user_id: user!.id, status: 'pending' });
    } else if (modal?.type === 'edit-game' && modal.data) {
      updateGame((modal.data as Game).id, formData);
    }
    setModal(null);
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'user') deleteUser(id);
    else if (type === 'post') deletePost(id);
    else if (type === 'game') deleteGame(id);
    setConfirmDelete(null);
    setModal(null);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-900/95 border-r border-white/5 z-50 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">DevRealm</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">管理后台</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            用户管理
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'posts'
                ? 'bg-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            帖子管理
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'games'
                ? 'bg-primary/20 text-primary'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            游戏管理
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">
                {activeTab === 'dashboard' && '数据概览'}
                {activeTab === 'users' && '用户管理'}
                {activeTab === 'posts' && '帖子管理'}
                {activeTab === 'games' && '游戏管理'}
              </h1>
              <p className="text-gray-400">系统管理与数据统计</p>
            </div>
            {(activeTab === 'users' || activeTab === 'posts' || activeTab === 'games') && (
              <button
                onClick={() => {
                  if (activeTab === 'users') setModal({ type: 'create-user' });
                  else if (activeTab === 'posts') setModal({ type: 'create-post' });
                  else setModal({ type: 'create-game' });
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
              >
                <Plus className="w-5 h-5" />
                {activeTab === 'users' && '新增用户'}
                {activeTab === 'posts' && '新增帖子'}
                {activeTab === 'games' && '新增游戏'}
              </button>
            )}
          </div>

          {(activeTab === 'users' || activeTab === 'posts' || activeTab === 'games') && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-dark-700/50 border border-white/5 flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'users' ? '搜索用户名或邮箱...' : activeTab === 'posts' ? '搜索帖子标题...' : '搜索游戏名称...'}
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
              >
                <option value="">全部状态</option>
                {activeTab === 'users' && (
                  <>
                    <option value="active">正常用户</option>
                    <option value="banned">已封禁</option>
                  </>
                )}
                {activeTab === 'posts' && (
                  <>
                    <option value="published">已发布</option>
                    <option value="pending">待审核</option>
                    <option value="hidden">已隐藏</option>
                  </>
                )}
                {activeTab === 'games' && (
                  <>
                    <option value="published">已发布</option>
                    <option value="pending">待审核</option>
                    <option value="rejected">已拒绝</option>
                  </>
                )}
              </select>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-card p-5 hover-lift">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-700/50">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-6">用户增长趋势</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((month, index) => (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary" style={{ height: `${Math.random() * 80 + 10}%` }} />
                        <span className="text-xs text-gray-500">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-6">用户角色分布</h3>
                  <div className="space-y-4">
                    {[
                      { role: '普通用户', count: users.filter(u => u.role === 'user').length, color: 'bg-primary' },
                      { role: 'VIP会员', count: users.filter(u => u.role === 'vip').length, color: 'bg-accent' },
                      { role: '专家', count: users.filter(u => u.role === 'expert').length, color: 'bg-secondary' },
                      { role: '管理员', count: users.filter(u => u.role === 'admin').length, color: 'bg-green-500' },
                    ].map((item, index) => {
                      const percent = users.length > 0 ? Math.round((item.count / users.length) * 100) : 0;
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">{item.role}</span>
                            <span className="text-sm text-white">{item.count} ({percent}%)</span>
                          </div>
                          <div className="h-2 bg-dark-700/50 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-6">最近注册用户</h3>
                  <div className="space-y-3">
                    {filteredUsers.slice(0, 5).map((userItem) => (
                      <div key={userItem.id} className="flex items-center gap-4 p-3 bg-dark-700/30 rounded-xl">
                        <img src={userItem.avatar_url} alt={userItem.username} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{userItem.username}</p>
                          <p className="text-xs text-gray-500">{userItem.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(userItem.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-6">待审核内容</h3>
                  <div className="space-y-3">
                    {[...posts.filter(p => p.status === 'pending'), ...games.filter(g => g.status === 'pending')].slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-dark-700/30 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                          {item instanceof Object && 'title' in item ? <FileText className="w-5 h-5 text-yellow-400" /> : <Gamepad2 className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{(item as any).title || (item as any).name}</p>
                          <p className="text-xs text-gray-500">{item instanceof Object && 'category' in item ? (item as any).category : '游戏'}</p>
                        </div>
                        <span className="text-xs text-yellow-400">待审核</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass-card p-6">
              <div className="space-y-3">
                {filteredUsersByStatus.map((userItem) => (
                  <div
                    key={userItem.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      userItem.is_banned ? 'bg-red-500/10 border border-red-500/20' : 'bg-dark-700/30'
                    }`}
                  >
                    <img src={userItem.avatar_url} alt={userItem.username} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-white">{userItem.username}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          userItem.role === 'admin' ? 'bg-green-500/15 text-green-400' :
                          userItem.role === 'vip' ? 'bg-accent/15 text-accent' :
                          userItem.role === 'expert' ? 'bg-secondary/15 text-secondary' :
                          'bg-dark-600 text-gray-400'
                        }`}>
                          {userItem.role === 'admin' ? '管理员' : userItem.role === 'vip' ? 'VIP' : userItem.role === 'expert' ? '专家' : '普通用户'}
                        </span>
                        {userItem.is_banned && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">已封禁</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{userItem.email}</span>
                        <span>Lv.{userItem.level}</span>
                        <span>{userItem.reputation} 声望</span>
                        <span>{new Date(userItem.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ type: 'edit-user', data: userItem })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5"
                      >
                        <Edit3 className="w-4 h-4" />
                        编辑
                      </button>
                      <button
                        onClick={() => toggleBan(userItem.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          userItem.is_banned
                            ? 'bg-green-500/15 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/15 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        <Ban className="w-4 h-4" />
                        {userItem.is_banned ? '解封' : '封禁'}
                      </button>
                      <button
                        onClick={() => setModal({ type: 'delete', data: userItem })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="glass-card p-6">
              <div className="space-y-3">
                {filteredPostsByStatus.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-white">{post.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-500/15 text-green-400' :
                          post.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {post.status === 'published' ? '已发布' : post.status === 'pending' ? '待审核' : '已隐藏'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.category}</span>
                        <span>{post.likes} 点赞</span>
                        <span>{post.comments_count} 评论</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ type: 'edit-post', data: post })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5"
                      >
                        <Edit3 className="w-4 h-4" />
                        编辑
                      </button>
                      <button
                        onClick={() => updatePostStatus(post.id, post.status === 'published' ? 'hidden' : 'published')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          post.status === 'published'
                            ? 'bg-red-500/15 text-red-400 hover:bg-red-500/20'
                            : 'bg-green-500/15 text-green-400 hover:bg-green-500/20'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {post.status === 'published' ? '隐藏' : '发布'}
                      </button>
                      <button
                        onClick={() => setModal({ type: 'delete', data: post })}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGamesByStatus.map((game) => (
                <div
                  key={game.id}
                  className={`glass-card p-5 ${
                    game.status === 'pending' ? 'border-yellow-500/30' :
                    game.status === 'rejected' ? 'border-red-500/30' : ''
                  }`}
                >
                  <img src={game.cover_image || game.cover_url} alt={game.title || game.name} className="w-full h-32 rounded-xl object-cover mb-4" />
                  <h4 className="font-bold text-white mb-2">{game.title || game.name}</h4>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{game.developer}</span>
                    <span>{game.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      game.status === 'live' || game.status === 'approved' ? 'bg-green-500/15 text-green-400' :
                      game.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {game.status === 'live' || game.status === 'approved' ? '已发布' : game.status === 'pending' ? '待审核' : '已拒绝'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ type: 'edit-game', data: game })}
                        className="p-2 rounded-lg bg-dark-700/50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {game.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateGameStatus(game.id, 'approved')}
                            className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateGameStatus(game.id, 'rejected')}
                            className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setModal({ type: 'delete', data: game })}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {modal.type === 'create-user' && '新增用户'}
                {modal.type === 'edit-user' && '编辑用户'}
                {modal.type === 'create-post' && '新增帖子'}
                {modal.type === 'edit-post' && '编辑帖子'}
                {modal.type === 'create-game' && '新增游戏'}
                {modal.type === 'edit-game' && '编辑游戏'}
                {modal.type === 'delete' && '确认删除'}
              </h3>
              <button onClick={() => { setModal(null); setConfirmDelete(null); }} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modal.type === 'delete' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-white font-medium">确定要删除吗？</p>
                    <p className="text-gray-400 text-sm">此操作不可恢复</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setModal(null); setConfirmDelete(null); }}
                    className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-400 font-medium hover:bg-dark-600 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      if (modal.data) {
                        const type = modal.data instanceof Object && 'email' in modal.data ? 'user' : 
                                     modal.data instanceof Object && 'title' in modal.data ? 'post' : 'game';
                        handleDelete(type, (modal.data as any).id);
                      }
                    }}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            )}

            {(modal.type === 'create-user' || modal.type === 'edit-user') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">用户名</label>
                  <input
                    type="text"
                    value={(formData as UserType).username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">邮箱</label>
                  <input
                    type="email"
                    value={(formData as UserType).email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                {modal.type === 'create-user' && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">密码</label>
                    <input
                      type="password"
                      value={(formData as UserType).password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">角色</label>
                  <select
                    value={(formData as UserType).role || 'user'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserType['role'] })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  >
                    <option value="user">普通用户</option>
                    <option value="vip">VIP会员</option>
                    <option value="expert">专家</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">简介</label>
                  <textarea
                    value={(formData as UserType).bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveUser}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  保存
                </button>
              </div>
            )}

            {(modal.type === 'create-post' || modal.type === 'edit-post') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">标题</label>
                  <input
                    type="text"
                    value={(formData as Post).title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">分类</label>
                  <input
                    type="text"
                    value={(formData as Post).category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">内容</label>
                  <textarea
                    value={(formData as Post).content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={(formData as Post).tags?.join(', ') || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  onClick={handleSavePost}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  保存
                </button>
              </div>
            )}

            {(modal.type === 'create-game' || modal.type === 'edit-game') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">游戏名称</label>
                  <input
                    type="text"
                    value={(formData as Game).name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">中文标题</label>
                  <input
                    type="text"
                    value={(formData as Game).title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">开发商</label>
                  <input
                    type="text"
                    value={(formData as Game).developer || ''}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">分类</label>
                  <input
                    type="text"
                    value={(formData as Game).category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">描述</label>
                  <textarea
                    value={(formData as Post).content || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveGame}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  保存
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}