import { useState } from 'react';
import { Star, Award, Trophy, TrendingUp, Calendar, Settings, Edit3, Check, X, ChevronRight, User, Mail, MapPin, Globe } from 'lucide-react';
import { mockUsers, mockBadges, mockAchievements, mockPosts } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';

type TabType = 'overview' | 'badges' | 'achievements' | 'settings';

export default function Profile() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || '游戏开发者',
    bio: '热爱游戏开发，专注于独立游戏创作',
    location: '北京',
    website: 'https://devrealm.com',
  });

  const currentUser = mockUsers.find((u) => u.id === user?.id) || mockUsers[0];
  const userPosts = mockPosts.filter((p) => p.user_id === currentUser.id);

  const userBadges = mockBadges.filter((b) => currentUser.badges.includes(b.id));
  const userAchievements = mockAchievements.filter((a) => currentUser.achievements.includes(a.id));

  const handleSave = () => {
    setIsEditing(false);
  };

  const progressPercent = Math.round((currentUser.reputation / 1000) * 100);

  return (
    <div className="min-h-screen pt-16">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary via-purple-500 to-secondary" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                className="w-32 h-32 rounded-2xl border-4 border-dark-800 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-accent to-secondary text-white text-sm font-bold">
                Lv.{currentUser.level}
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-white mb-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                        className="bg-dark-700/50 border border-primary/30 rounded-lg px-3 py-1 text-white outline-none"
                      />
                    ) : (
                      currentUser.username
                    )}
                  </h1>
                  <p className="text-primary font-medium">
                    {currentUser.role === 'admin' ? '管理员' : currentUser.role === 'vip' ? 'VIP 会员' : '普通用户'}
                  </p>
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/20 transition-colors font-medium"
                      >
                        <Check className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium border border-white/5"
                      >
                        <Edit3 className="w-4 h-4" />
                        编辑资料
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-secondary text-white font-medium hover:opacity-90 transition-all">
                        <Settings className="w-4 h-4" />
                        设置
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-400 mb-4 max-w-2xl">
                {isEditing ? (
                  <textarea
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    className="w-full bg-dark-700/50 border border-primary/30 rounded-lg px-3 py-2 text-white outline-none resize-none"
                    rows={2}
                  />
                ) : (
                  currentUser.bio
                )}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.location}
                      onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                      className="bg-dark-700/50 border border-primary/30 rounded-lg px-3 py-1 text-white outline-none text-sm"
                    />
                  ) : (
                    <span>{currentUser.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.website}
                      onChange={(e) => setEditedUser({ ...editedUser, website: e.target.value })}
                      className="bg-dark-700/50 border border-primary/30 rounded-lg px-3 py-1 text-white outline-none text-sm"
                    />
                  ) : (
                    <span className="hover:text-primary transition-colors cursor-pointer">{currentUser.website}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>注册于 {currentUser.created_at}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
            <div className="text-center p-4 bg-dark-700/30 rounded-xl">
              <p className="text-2xl font-bold text-white mb-1">{currentUser.reputation}</p>
              <p className="text-sm text-gray-500">声望值</p>
            </div>
            <div className="text-center p-4 bg-dark-700/30 rounded-xl">
              <p className="text-2xl font-bold text-white mb-1">{userPosts.length}</p>
              <p className="text-sm text-gray-500">发布帖子</p>
            </div>
            <div className="text-center p-4 bg-dark-700/30 rounded-xl">
              <p className="text-2xl font-bold text-white mb-1">{currentUser.badges.length}</p>
              <p className="text-sm text-gray-500">获得徽章</p>
            </div>
            <div className="text-center p-4 bg-dark-700/30 rounded-xl">
              <p className="text-2xl font-bold text-white mb-1">{currentUser.achievements.length}</p>
              <p className="text-sm text-gray-500">成就解锁</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">升级进度</span>
              <span className="text-sm text-primary">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-dark-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">还需 {1000 - currentUser.reputation} 声望升级到 Lv.{currentUser.level + 1}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-5 h-5" />
            个人概览
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-5 h-5" />
            徽章收藏
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-5 h-5" />
            成就系统
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            账号设置
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">我的帖子</h3>
            <div className="space-y-4">
              {userPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2">{post.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-1">{post.content.replace(/[#*`]/g, '').slice(0, 100)}...</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {post.views}
                    </span>
                    <span>{post.created_at}</span>
                  </div>
                </div>
              ))}
              {userPosts.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">暂无发布的帖子</p>
                  <button className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium">
                    发布第一篇帖子
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">徽章收藏</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockBadges.map((badge, index) => {
                const isUnlocked = currentUser.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-xl text-center transition-all ${
                      isUnlocked
                        ? 'bg-dark-700/50 border border-primary/30 hover-lift'
                        : 'bg-dark-800/50 border border-white/5 opacity-50'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isUnlocked ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-dark-600'
                      }`}
                    >
                      <Award className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <h4 className={`font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-xs ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isUnlocked ? badge.description : '未解锁'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">成就系统</h3>
            <div className="space-y-4">
              {mockAchievements.map((achievement, index) => {
                const isUnlocked = currentUser.achievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isUnlocked
                        ? 'bg-dark-700/50 border border-accent/30'
                        : 'bg-dark-800/50 border border-white/5'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUnlocked ? 'bg-gradient-to-br from-accent to-secondary' : 'bg-dark-600'
                      }`}
                    >
                      <Trophy className={`w-7 h-7 ${isUnlocked ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h4>
                        {isUnlocked && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent">
                            已解锁
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isUnlocked ? 'text-accent' : 'text-gray-600'}`}>
                        {achievement.points}
                      </p>
                      <p className="text-xs text-gray-500">积分</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">账号设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-4">基本信息</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">用户名</label>
                    <input
                      type="text"
                      defaultValue={currentUser.username}
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">邮箱</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">简介</label>
                    <textarea
                      defaultValue={currentUser.bio}
                      rows={3}
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary resize-none text-white"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4">安全设置</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">密码</label>
                    <input
                      type="password"
                      placeholder="输入新密码"
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">确认密码</label>
                    <input
                      type="password"
                      placeholder="确认新密码"
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                    <div>
                      <p className="font-medium text-white">双因素认证</p>
                      <p className="text-sm text-gray-500">增加账号安全性</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
                      启用
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
              <button className="px-6 py-3 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-white/5 transition-colors font-medium">
                取消
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all">
                保存设置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}