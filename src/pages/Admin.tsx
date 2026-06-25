import { useState } from 'react';
import { Users, FileText, Gamepad2, BarChart3, Search, Filter, Check, X, Ban, Trash2, Edit3, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { mockUsers, mockPosts, mockGames } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';

type TabType = 'dashboard' | 'users' | 'posts' | 'games';

export default function Admin() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  const stats = [
    { label: '总用户数', value: '1,234', icon: Users, color: 'text-primary', change: '+12%' },
    { label: '帖子总数', value: '5,678', icon: FileText, color: 'text-secondary', change: '+8%' },
    { label: '已发布游戏', value: '89', icon: Gamepad2, color: 'text-accent', change: '+15%' },
    { label: '待审核', value: '12', icon: Clock, color: 'text-yellow-400', change: '' },
  ];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || (filterStatus === 'banned' ? u.is_banned : !u.is_banned);
    return matchesSearch && matchesStatus;
  });

  const filteredPosts = mockPosts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredGames = mockGames.filter((g) => {
    const matchesSearch = (g.title || g.name).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || g.status === filterStatus || 
      (filterStatus === 'published' && (g.status === 'live' || g.status === 'approved'));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">管理后台</h1>
            <p className="text-gray-400">系统管理与数据统计</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary">
            <Users className="w-4 h-4" />
            管理员视图
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            用户管理
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            帖子管理
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            游戏审核
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-5 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-dark-700/50`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    {stat.change && (
                      <span className="text-xs text-green-400">{stat.change}</span>
                    )}
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
                    { role: '普通用户', count: 856, color: 'bg-primary' },
                    { role: 'VIP会员', count: 289, color: 'bg-accent' },
                    { role: '专家', count: 67, color: 'bg-secondary' },
                    { role: '管理员', count: 22, color: 'bg-green-500' },
                  ].map((item, index) => {
                    const percent = Math.round((item.count / 1234) * 100);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">{item.role}</span>
                          <span className="text-sm text-white">{item.count} ({percent}%)</span>
                        </div>
                        <div className="h-2 bg-dark-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
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
                  {mockUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-3 bg-dark-700/30 rounded-xl">
                      <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">{user.created_at}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-xl font-bold text-white mb-6">待审核游戏</h3>
                <div className="space-y-3">
                  {mockGames.filter((g) => g.status === 'pending').slice(0, 5).map((game) => (
                    <div key={game.id} className="flex items-center gap-4 p-3 bg-dark-700/30 rounded-xl">
                      <img src={game.cover_image || game.cover_url} alt={game.title || game.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{game.title || game.name}</p>
                        <p className="text-xs text-gray-500">{game.developer || game.user?.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                          审核通过
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                          拒绝
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="font-display text-xl font-bold text-white">用户管理</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-dark-700/50 border border-white/5">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索用户名或邮箱..."
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
                >
                  <option value="">全部状态</option>
                  <option value="active">正常用户</option>
                  <option value="banned">已封禁</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    user.is_banned ? 'bg-red-500/10 border border-red-500/20' : 'bg-dark-700/30'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img src={user.avatar_url} alt={user.username} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-white">{user.username}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-green-500/15 text-green-400' :
                          user.role === 'vip' ? 'bg-accent/15 text-accent' :
                          user.role === 'expert' ? 'bg-secondary/15 text-secondary' :
                          'bg-dark-600 text-gray-400'
                        }`}
                      >
                        {user.role === 'admin' ? '管理员' : user.role === 'vip' ? 'VIP' : user.role === 'expert' ? '专家' : '普通用户'}
                      </span>
                      {user.is_banned && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
                          已封禁
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{user.email}</span>
                      <span>Lv.{user.level}</span>
                      <span>{user.reputation} 声望</span>
                      <span>{user.created_at}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
                      <Edit3 className="w-4 h-4" />
                      编辑
                    </button>
                    {user.is_banned ? (
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/15 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors">
                        <Ban className="w-4 h-4" />
                        解封
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                        <Ban className="w-4 h-4" />
                        封禁
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="font-display text-xl font-bold text-white">帖子管理</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-dark-700/50 border border-white/5">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索帖子标题..."
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
                >
                  <option value="">全部状态</option>
                  <option value="published">已发布</option>
                  <option value="pending">待审核</option>
                  <option value="hidden">已隐藏</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-white">{post.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-500/15 text-green-400' :
                          post.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {post.status === 'published' ? '已发布' : post.status === 'pending' ? '待审核' : '已隐藏'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.user?.username}</span>
                      <span>{post.likes} 点赞</span>
                      <span>{post.comments_count} 评论</span>
                      <span>{post.category}</span>
                      <span>{post.created_at}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
                      <Edit3 className="w-4 h-4" />
                      编辑
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
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
          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="font-display text-xl font-bold text-white">游戏审核</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-dark-700/50 border border-white/5">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索游戏名称..."
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
                >
                  <option value="">全部状态</option>
                  <option value="pending">待审核</option>
                  <option value="published">已发布</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`glass-card p-5 animate-fade-in ${
                    game.status === 'pending' ? 'border-yellow-500/30' :
                    game.status === 'rejected' ? 'border-red-500/30' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={game.cover_image || game.cover_url} alt={game.title || game.name} className="w-full h-32 rounded-xl object-cover mb-4" />
                  <h4 className="font-bold text-white mb-2">{game.title || game.name}</h4>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{game.developer || game.user?.username}</span>
                    <span>{game.genre || game.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        game.status === 'published' || game.status === 'live' || game.status === 'approved' ? 'bg-green-500/15 text-green-400' :
                        game.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                        'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {game.status === 'published' || game.status === 'live' || game.status === 'approved' ? '已发布' : game.status === 'pending' ? '待审核' : '已拒绝'}
                    </span>
                    {game.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                          <Check className="w-4 h-4 inline" />
                          通过
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                          <X className="w-4 h-4 inline" />
                          拒绝
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}