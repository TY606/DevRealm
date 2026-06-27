import { useEffect, useState } from 'react';
import { 
  Users, FileText, Gamepad2, Clock, TrendingUp, AlertCircle, 
  CheckCircle, Shield, Activity, ArrowUpRight, ArrowDownRight,
  Zap, Globe, Database, Server, Lock, Heart, MessageSquare,
  Eye, XCircle, Wifi, WifiOff, HardDrive, Cpu, MemoryStick,
  Calendar, RefreshCw, ChevronRight
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import { useGameStore } from '@/store/gameStore';
import { useAuditStore } from '@/store/auditStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const { users, initUsers } = useUserStore();
  const { posts, initPosts } = usePostStore();
  const { games, initGames } = useGameStore();
  const { logs, initLogs } = useAuditStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    initUsers();
    initPosts();
    initGames();
    initLogs();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      label: '总用户数', 
      value: users.length.toString(), 
      icon: Users, 
      color: 'admin-primary',
      bgColor: 'bg-admin-primary/10',
      trend: '+12%',
      trendUp: true,
      description: '本月新增'
    },
    { 
      label: '活跃用户', 
      value: Math.floor(users.length * 0.65).toString(), 
      icon: Activity, 
      color: 'admin-success',
      bgColor: 'bg-admin-success/10',
      trend: '+8%',
      trendUp: true,
      description: '近7天'
    },
    { 
      label: '帖子总数', 
      value: posts.length.toString(), 
      icon: FileText, 
      color: 'admin-secondary',
      bgColor: 'bg-admin-secondary/10',
      trend: '+24%',
      trendUp: true,
      description: '本周新增'
    },
    { 
      label: '待审核', 
      value: [...posts, ...games].filter(item => item.status === 'pending').length.toString(), 
      icon: Clock, 
      color: 'admin-warning',
      bgColor: 'bg-admin-warning/10',
      trend: '+5',
      trendUp: true,
      description: '急需处理'
    },
    { 
      label: '已发布游戏', 
      value: games.filter(g => g.status === 'live' || g.status === 'approved').length.toString(), 
      icon: Gamepad2, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      trend: '+3',
      trendUp: true,
      description: '本月发布'
    },
    { 
      label: '今日登录', 
      value: '128', 
      icon: Zap, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      trend: '+15%',
      trendUp: true,
      description: '较昨日'
    },
  ];

  const weeklyData = [
    { day: '周一', users: 45, posts: 12, games: 3 },
    { day: '周二', users: 52, posts: 18, games: 2 },
    { day: '周三', users: 38, posts: 15, games: 5 },
    { day: '周四', users: 61, posts: 22, games: 4 },
    { day: '周五', users: 75, posts: 28, games: 6 },
    { day: '周六', users: 92, posts: 35, games: 8 },
    { day: '周日', users: 88, posts: 32, games: 7 },
  ];

  const monthlyData = [
    { month: '1月', active: 280, new: 45 },
    { month: '2月', active: 310, new: 52 },
    { month: '3月', active: 340, new: 68 },
    { month: '4月', active: 380, new: 75 },
    { month: '5月', active: 420, new: 82 },
    { month: '6月', active: 480, new: 95 },
  ];

  const roleDistribution = [
    { name: '普通用户', value: users.filter(u => u.role === 'user').length, color: '#3B82F6' },
    { name: 'VIP会员', value: users.filter(u => u.role === 'vip').length, color: '#F59E0B' },
    { name: '专家', value: users.filter(u => u.role === 'expert').length, color: '#8B5CF6' },
    { name: '管理员', value: users.filter(u => u.role === 'admin').length, color: '#10B981' },
  ];

  const securityAlerts = [
    { type: 'success', message: '系统运行正常', time: '刚刚', icon: CheckCircle },
    { type: 'warning', message: '检测到异常登录尝试', time: '5分钟前', icon: AlertCircle },
    { type: 'success', message: '安全更新已应用', time: '1小时前', icon: Shield },
    { type: 'info', message: 'IP黑名单已更新', time: '2小时前', icon: Lock },
  ];

  const recentActivity = logs.slice(0, 6).map((log) => ({
    ...log,
    time: new Date(log.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }));

  const systemHealth = [
    { name: 'CPU', value: 45, status: 'healthy' },
    { name: '内存', value: 62, status: 'healthy' },
    { name: '存储', value: 78, status: 'warning' },
    { name: '网络', value: 23, status: 'healthy' },
  ];

  const topUsers = users.slice(0, 5).map(user => ({
    ...user,
    recentPosts: Math.floor(Math.random() * 10) + 1,
    recentComments: Math.floor(Math.random() * 20) + 1,
  }));

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">数据概览</h1>
          <p className="text-admin-text-muted mt-2">欢迎回来，管理员！以下是平台实时运行数据</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-admin-dropdown rounded-xl border border-admin-border">
            <Server className="w-4 h-4 text-admin-success" />
            <span className="text-sm text-admin-text-secondary">系统在线</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-admin-dropdown rounded-xl border border-admin-border">
            <Calendar className="w-4 h-4 text-admin-text-muted" />
            <span className="text-sm text-admin-text-secondary">{currentTime.toLocaleDateString('zh-CN')}</span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              autoRefresh 
                ? 'bg-admin-primary/15 text-admin-primary' 
                : 'bg-admin-dropdown text-admin-text-muted border border-admin-border'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span className="text-sm">自动刷新</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="admin-card p-5 hover-lift group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-admin-success' : 'text-admin-danger'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{stat.trend}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-admin-text-muted">{stat.label}</p>
            <p className="text-xs text-admin-text-muted/60 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-white">本周数据趋势</h3>
            <div className="flex items-center gap-4">
              <button className="px-3 py-1.5 rounded-lg bg-admin-primary/15 text-admin-primary text-sm font-medium">周视图</button>
              <button className="px-3 py-1.5 rounded-lg text-admin-text-muted text-sm hover:text-white transition-colors">月视图</button>
              <button className="px-3 py-1.5 rounded-lg text-admin-text-muted text-sm hover:text-white transition-colors">年视图</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="postGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gameGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#6366F1" fillOpacity={1} fill="url(#userGradient)" />
                <Area type="monotone" dataKey="posts" stroke="#EC4899" fillOpacity={1} fill="url(#postGradient)" />
                <Area type="monotone" dataKey="games" stroke="#F59E0B" fillOpacity={1} fill="url(#gameGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4">
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-admin-primary" />
              <span className="text-admin-text-muted">用户</span>
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-admin-secondary" />
              <span className="text-admin-text-muted">帖子</span>
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-admin-warning" />
              <span className="text-admin-text-muted">游戏</span>
            </span>
          </div>
        </div>

        <div className="admin-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-6">用户角色分布</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [`${value} 人`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-white">实时活动流</h3>
            <span className="text-xs text-admin-success flex items-center gap-1">
              <span className="w-2 h-2 bg-admin-success rounded-full animate-pulse" />
              实时更新
            </span>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-admin-dropdown/50 rounded-xl hover:bg-admin-dropdown transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.result === 'success' ? 'bg-admin-success/10' : 'bg-admin-danger/10'
                  }`}>
                    {activity.result === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-admin-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-admin-danger" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user_name}</span>
                      <span className="text-admin-text-muted"> 执行了 </span>
                      <span className="text-admin-primary">{activity.action}</span>
                      <span className="text-admin-text-muted"> 操作</span>
                      {activity.target_name && (
                        <span className="text-admin-text-muted"> 于 </span>
                      )}
                      <span className="text-admin-secondary">{activity.target_name}</span>
                    </p>
                    <p className="text-xs text-admin-text-muted">{activity.module} - {activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-admin-text-muted mx-auto mb-3" />
                <p className="text-admin-text-muted">暂无活动记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-6">安全警报</h3>
          <div className="space-y-3">
            {securityAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  alert.type === 'success' ? 'bg-admin-success/10' :
                  alert.type === 'warning' ? 'bg-admin-warning/10' :
                  'bg-blue-500/10'
                }`}
              >
                <alert.icon className={`w-5 h-5 ${
                  alert.type === 'success' ? 'text-admin-success' :
                  alert.type === 'warning' ? 'text-admin-warning' :
                  'text-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{alert.message}</p>
                  <p className="text-xs text-admin-text-muted">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl border border-admin-border text-admin-text-secondary text-sm hover:text-white hover:bg-admin-hover transition-colors">
            查看全部安全事件
          </button>
        </div>

        <div className="admin-card p-6">
          <h3 className="font-display text-xl font-bold text-white mb-6">系统健康度</h3>
          <div className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-admin-text-muted">{item.name}</span>
                  <span className={`text-sm font-medium ${
                    item.status === 'healthy' ? 'text-admin-success' : 'text-admin-warning'
                  }`}>{item.value}%</span>
                </div>
                <div className="h-2.5 bg-admin-dropdown rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'healthy' ? 'bg-admin-success' : 'bg-admin-warning'
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-admin-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-admin-text-muted">整体状态</span>
                <span className="text-sm font-medium text-admin-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  健康
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-6">
            {[
              { icon: Cpu, label: 'CPU', status: 'healthy' },
              { icon: MemoryStick, label: '内存', status: 'healthy' },
              { icon: HardDrive, label: '存储', status: 'warning' },
              { icon: Wifi, label: '网络', status: 'healthy' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                  item.status === 'healthy' ? 'bg-admin-success/10' : 'bg-admin-warning/10'
                }`}>
                  <item.icon className={`w-5 h-5 ${item.status === 'healthy' ? 'text-admin-success' : 'text-admin-warning'}`} />
                </div>
                <p className="text-xs text-admin-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-white">活跃用户排行</h3>
            <button className="flex items-center gap-1 text-sm text-admin-primary hover:text-admin-primary/80 transition-colors">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-4 p-3 bg-admin-dropdown/30 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-admin-icon-bg flex items-center justify-center text-lg font-bold text-admin-primary">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{user.username}</p>
                  <p className="text-xs text-admin-text-muted">
                    <span className="text-admin-success">{user.recentPosts}</span> 帖子 · 
                    <span className="text-admin-secondary">{user.recentComments}</span> 评论
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-admin-primary">{user.reputation}</p>
                  <p className="text-xs text-admin-text-muted">声望</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-white">最新帖子</h3>
            <button className="flex items-center gap-1 text-sm text-admin-primary hover:text-admin-primary/80 transition-colors">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 p-3 bg-admin-dropdown/30 rounded-xl">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  post.status === 'published' ? 'bg-admin-success/10' :
                  post.status === 'pending' ? 'bg-admin-warning/10' :
                  'bg-admin-danger/10'
                }`}>
                  {post.status === 'published' ? (
                    <CheckCircle className="w-5 h-5 text-admin-success" />
                  ) : post.status === 'pending' ? (
                    <Clock className="w-5 h-5 text-admin-warning" />
                  ) : (
                    <XCircle className="w-5 h-5 text-admin-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm line-clamp-1">{post.title}</p>
                  <p className="text-xs text-admin-text-muted mt-1">{post.category} · {post.comments_count} 评论 · {post.likes} 点赞</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}