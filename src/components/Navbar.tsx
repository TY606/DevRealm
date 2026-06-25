import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Brain, Rocket, User, LogOut, ChevronDown, Search, Gamepad2, Shield, Bell, Settings, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: '首页', icon: Gamepad2 },
    { path: '/forum', label: '论坛', icon: MessageSquare },
    { path: '/ai', label: 'AI开发', icon: Brain },
    { path: '/publish', label: '游戏发布', icon: Rocket },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center group-hover:animate-pulse-glow">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              </div>
              <span className="font-display text-xl font-bold text-gradient">DevRealm</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-primary/20 text-white shadow-lg shadow-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 ${
              searchFocused ? 'bg-dark-700 border border-primary/30 shadow-lg shadow-primary/10' : 'bg-dark-700/50 border border-white/5'
            }`}>
              <Search className={`w-4 h-4 transition-colors ${searchFocused ? 'text-primary' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="搜索论坛、游戏、用户..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-48 lg:w-64"
              />
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                      alt={user?.username}
                      className="w-9 h-9 rounded-full border-2 border-white/10 group-hover:border-primary transition-colors"
                    />
                    {role === 'vip' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {role === 'admin' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-gray-500">
                      {role === 'admin' ? '管理员' : role === 'vip' ? 'VIP 会员' : '普通用户'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card border border-white/8 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
                    <div className="p-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                          alt={user?.username}
                          className="w-12 h-12 rounded-full border-2 border-primary/30"
                        />
                        <div>
                          <p className="font-bold text-white">{user?.username}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>个人中心</span>
                      </Link>
                      <Link
                        to="/profile#achievements"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        <span>通知</span>
                      </Link>
                      {role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>管理后台</span>
                        </Link>
                      )}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>账户设置</span>
                      </button>
                      <div className="border-t border-white/5 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  免费注册
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/5 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-primary/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-dark-700/50 border border-white/5 mb-4">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索内容..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
                />
              </div>
              {!isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-center text-sm font-medium text-gray-300"
                  >
                    登录
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-center text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    免费注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}