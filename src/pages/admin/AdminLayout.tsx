import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Gamepad2, Shield, Settings, 
  Activity, ChevronLeft, ChevronRight, Bell, Search, LogOut, 
  Menu, X, User, BarChart3, Lock, Database, AlertTriangle, 
  MessageSquare, Globe, Sparkles, Tag, Clock, Zap, HelpCircle,
  ChevronDown, Command
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';
import { useGameStore } from '@/store/gameStore';
import { useAuditStore } from '@/store/auditStore';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: '数据概览', badge: null },
  { path: '/admin/users', icon: Users, label: '用户管理', badge: null },
  { path: '/admin/content', icon: FileText, label: '内容审核', badge: 'pending' },
  { path: '/admin/games', icon: Gamepad2, label: '游戏管理', badge: null },
  { path: '/admin/security', icon: Shield, label: '安全中心', badge: 'alerts' },
  { path: '/admin/audit', icon: Activity, label: '操作日志', badge: null },
  { path: '/admin/settings', icon: Settings, label: '系统设置', badge: null },
];

const bottomItems = [
  { path: '/admin/database', icon: Database, label: '数据管理' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { posts } = usePostStore();
  const { games } = useGameStore();
  const { logs } = useAuditStore();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActivePath = () => {
    const path = location.pathname;
    if (path === '/admin') return '/admin';
    return menuItems.find(item => path.startsWith(item.path))?.path || '/admin';
  };

  const pendingCount = [...posts, ...games].filter(item => item.status === 'pending').length;
  const alertCount = logs.filter(l => l.result === 'failed' || l.action.includes('封禁') || l.action.includes('拒绝')).length;

  const getBadgeValue = (badge: string | null) => {
    if (badge === 'pending') return pendingCount > 0 ? pendingCount : null;
    if (badge === 'alerts') return alertCount > 0 ? alertCount : null;
    return badge;
  };

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <aside 
        className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-admin-sidebar border-r border-admin-border`}
      >
        <div className="p-5 border-b border-admin-border flex items-center justify-between">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-admin-primary to-admin-secondary flex items-center justify-center shadow-lg shadow-admin-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-display text-xl font-bold text-white">DevRealm</h1>
                <p className="text-xs text-admin-text-muted">管理控制台</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const badgeValue = getBadgeValue(item.badge);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-admin-primary/15 text-admin-primary shadow-lg shadow-admin-primary/10'
                    : 'text-admin-text-secondary hover:text-white hover:bg-admin-hover'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-admin-primary/20' : 'bg-admin-icon-bg group-hover:bg-admin-icon-hover'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-admin-primary' : 'text-admin-text-muted group-hover:text-white'}`} />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {badgeValue !== null && badgeValue !== undefined && badgeValue !== 0 && (
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-admin-danger text-white rounded-full animate-pulse">
                        {badgeValue}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && badgeValue !== null && badgeValue !== undefined && badgeValue !== 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-admin-danger rounded-full animate-pulse" />
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-4 py-2.5 bg-admin-tooltip rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    {item.label}
                    {badgeValue !== null && badgeValue !== undefined && badgeValue !== 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-admin-danger text-white rounded-full">
                        {badgeValue}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-border space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group relative ${
                  isActive
                    ? 'bg-admin-secondary/15 text-admin-secondary'
                    : 'text-admin-text-secondary hover:text-white hover:bg-admin-hover'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-admin-secondary/20' : 'bg-admin-icon-bg group-hover:bg-admin-icon-hover'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-4 py-2.5 bg-admin-tooltip rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-admin-sidebar border border-admin-border flex items-center justify-center text-admin-text-muted hover:text-white hover:bg-admin-hover transition-all shadow-lg"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      <div className={`flex-1 transition-all duration-300 ease-out ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="fixed top-0 right-0 h-17 bg-admin-header/80 backdrop-blur-xl border-b border-admin-border z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-admin-hover transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-admin-text-muted">
              <Globe className="w-4 h-4" />
              <span>中文</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className={`relative hidden lg:flex items-center gap-3 rounded-xl px-4 py-2.5 bg-admin-search border border-admin-border transition-all duration-300 ${searchFocused ? 'border-admin-primary/40 shadow-lg shadow-admin-primary/10 w-80' : 'w-64'}`}>
            <Search className={`w-5 h-5 transition-colors ${searchFocused ? 'text-admin-primary' : 'text-admin-text-muted'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索用户、帖子、游戏..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-admin-text-muted w-full"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs bg-admin-hover rounded text-admin-text-muted">
              <Command className="w-3 h-3" />
              K
            </kbd>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-admin-text-muted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-admin-hover text-admin-text-secondary hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">帮助</span>
            </button>

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-admin-hover transition-colors"
            >
              <Bell className="w-5 h-5 text-admin-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-admin-danger rounded-full" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-admin-hover transition-colors"
              >
                <div className="relative">
                  <img
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                    alt={user?.username}
                    className="w-9 h-9 rounded-full border-2 border-admin-primary/30"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-admin-header" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-admin-text-muted">超级管理员</p>
                </div>
                <ChevronDown className="w-4 h-4 text-admin-text-muted" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-admin-dropdown border border-admin-border rounded-xl overflow-hidden shadow-2xl z-50 animate-scale-in">
                    <div className="p-4 border-b border-admin-border">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                          alt={user?.username}
                          className="w-12 h-12 rounded-full border-2 border-admin-primary/30"
                        />
                        <div>
                          <p className="font-medium text-white">{user?.username}</p>
                          <p className="text-sm text-admin-text-muted">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
                        <User className="w-4 h-4" />
                        <span>账户设置</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
                        <Shield className="w-4 h-4" />
                        <span>安全设置</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        <span>帮助中心</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-admin-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-admin-danger hover:bg-admin-danger/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-17 bottom-0 w-80 bg-admin-sidebar border-r border-admin-border p-5 space-y-4 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-admin-primary to-admin-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-white">DevRealm</h1>
                  <p className="text-xs text-admin-text-muted">管理控制台</p>
                </div>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const badgeValue = getBadgeValue(item.badge);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {badgeValue !== null && badgeValue !== undefined && badgeValue !== 0 && (
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-admin-danger text-white rounded-full">
                        {badgeValue}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-4 top-20 w-80 bg-admin-dropdown border border-admin-border rounded-xl overflow-hidden shadow-2xl z-50 animate-scale-in max-h-[60vh] overflow-y-auto">
              <div className="p-4 border-b border-admin-border flex items-center justify-between">
                <h3 className="font-semibold text-white">通知中心</h3>
                <span className="text-xs text-admin-text-muted">3 条未读</span>
              </div>
              <div className="p-2 space-y-2">
                {[
                  { type: 'warning', title: '内容审核提醒', message: '有 5 篇帖子待审核', time: '5分钟前' },
                  { type: 'danger', title: '安全警告', message: '检测到异常登录尝试', time: '15分钟前' },
                  { type: 'success', title: '用户注册', message: '新用户 GameMaster 已注册', time: '1小时前' },
                ].map((notification, index) => (
                  <button key={index} className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-admin-hover transition-colors text-left">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'warning' ? 'bg-admin-warning/10' :
                      notification.type === 'danger' ? 'bg-admin-danger/10' :
                      'bg-admin-success/10'
                    }`}>
                      {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-admin-warning" />}
                      {notification.type === 'danger' && <Lock className="w-5 h-5 text-admin-danger" />}
                      {notification.type === 'success' && <Users className="w-5 h-5 text-admin-success" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{notification.title}</p>
                      <p className="text-xs text-admin-text-muted truncate">{notification.message}</p>
                      <p className="text-xs text-admin-text-muted mt-1">{notification.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-admin-border">
                <button className="w-full py-2 rounded-lg text-sm text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
                  查看全部通知
                </button>
              </div>
            </div>
          </>
        )}

        <main className="pt-17 min-h-screen">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}