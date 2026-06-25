import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Rocket, Star, TrendingUp, Users, Code, Gamepad2, Zap, Award, ArrowRight, Sparkles, Globe, Github, Twitter } from 'lucide-react';
import { mockPosts, mockGames, mockUsers } from '@/utils/mockData';

export default function Home() {
  const quickLinks = [
    {
      icon: MessageSquare,
      title: '游戏开发论坛',
      description: '与全球开发者交流技术、分享经验',
      color: 'from-purple-600 via-violet-600 to-indigo-600',
      path: '/forum',
      stat: '58K+ 帖子',
    },
    {
      icon: Brain,
      title: 'AI辅助开发',
      description: '智能代码助手，加速开发效率',
      color: 'from-blue-600 via-cyan-600 to-teal-600',
      path: '/ai',
      stat: '1.2M+ 代码生成',
    },
    {
      icon: Rocket,
      title: '游戏发布中心',
      description: '多平台一键发布，全球发行',
      color: 'from-green-600 via-emerald-600 to-teal-600',
      path: '/publish',
      stat: '2.3K+ 游戏',
    },
    {
      icon: Award,
      title: '专家咨询',
      description: 'VIP专属专家团队技术支持',
      color: 'from-yellow-500 via-orange-500 to-red-500',
      path: '/ai/expert',
      stat: '50+ 专家',
    },
  ];

  const stats = [
    { icon: Users, label: '活跃用户', value: '12,850+', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: MessageSquare, label: '论坛帖子', value: '58,200+', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Gamepad2, label: '发布游戏', value: '2,340+', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Code, label: 'AI生成代码', value: '1.2M+', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="min-h-screen pt-16 relative">
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
        
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(107, 33, 168, 0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">全新AI开发工具上线</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">游戏开发者的</span>
              <br />
              <span className="text-gradient">综合平台</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              DevRealm 融合社区论坛、AI辅助开发与多渠道发行，
              覆盖从创意构思到上线发行的完整链路
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/forum"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-secondary text-white font-semibold text-lg hover:opacity-90 transition-all hover:shadow-2xl hover:shadow-primary/30 flex items-center justify-center gap-2"
              >
                探索论坛
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ai"
                className="w-full sm:w-auto px-10 py-4 rounded-xl glass-button text-white font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                体验AI开发
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="glass-card p-6 text-center hover-lift group">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">核心功能</span>
            </h2>
            <p className="text-gray-400 text-lg">一站式解决游戏开发全流程需求</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="group glass-card p-6 hover-lift relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="relative text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                
                <p className="relative text-gray-400 text-sm mb-4">{link.description}</p>
                
                <div className="relative inline-flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                  <span>{link.stat}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient">热门帖子</span>
              </h2>
              <p className="text-gray-400">社区最新技术分享与讨论</p>
            </div>
            <Link
              to="/forum"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass-button text-white hover:text-primary transition-colors"
            >
              查看更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPosts.slice(0, 6).map((post, index) => (
              <Link
                key={post.id}
                to={`/forum/${post.id}`}
                className="glass-card p-6 hover-lift group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.user?.avatar_url}
                    alt={post.user?.username}
                    className="w-10 h-10 rounded-full border-2 border-white/5 group-hover:border-primary/30 transition-colors"
                  />
                  <div>
                    <p className="font-medium text-sm text-white">{post.user?.username}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.content.replace(/[#*`]/g, '').slice(0, 100)}...
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-accent transition-colors">
                      <Star className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-secondary transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments_count}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                    {post.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient">最新发布</span>
              </h2>
              <p className="text-gray-400">探索社区开发者发布的精彩游戏</p>
            </div>
            <Link
              to="/publish"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-green-600 text-white font-medium hover:opacity-90 transition-all"
            >
              <Rocket className="w-4 h-4" />
              发布游戏
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGames.map((game, index) => (
              <div key={game.id} className="glass-card overflow-hidden hover-lift group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={game.cover_url}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                      game.status === 'live' ? 'bg-accent/20 text-accent border border-accent/30' :
                      game.status === 'approved' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
                      'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    }`}>
                      {game.status === 'live' ? '已上线' :
                       game.status === 'approved' ? '已通过' : '审核中'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-dark-700/80 backdrop-blur-sm text-gray-300">
                      {game.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={game.user?.avatar_url}
                        alt={game.user?.username}
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                      <span className="text-sm text-gray-300">{game.user?.username}</span>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Globe className="w-4 h-4" />
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">社区达人</span>
            </h2>
            <p className="text-gray-400 text-lg">认识我们最活跃的社区成员</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockUsers.map((user, index) => (
              <div key={user.id} className="glass-card p-6 text-center hover-lift group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative inline-block mb-4">
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-primary/30 transition-colors"
                  />
                  {user.role === 'vip' && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                      <Award className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1 text-white">{user.username}</h3>
                <p className="text-sm text-gray-400 mb-3">{user.bio}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4" />
                    {user.reputation}
                  </span>
                  <span className="flex items-center gap-1 text-secondary">
                    <TrendingUp className="w-4 h-4" />
                    Lv.{user.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="relative">
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-accent" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">准备好开始了吗？</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                加入 DevRealm，与全球游戏开发者一起成长
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-secondary text-white font-semibold text-lg hover:opacity-90 transition-all hover:shadow-2xl hover:shadow-primary/30"
                >
                  免费注册
                </Link>
                <Link
                  to="/forum"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl glass-button text-white font-semibold text-lg"
                >
                  浏览论坛
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-gradient">DevRealm</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                游戏开发者的综合平台，覆盖从创意构思到上线发行的完整链路。
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-5">功能模块</h4>
              <ul className="space-y-3">
                <li><Link to="/forum" className="text-gray-400 hover:text-white transition-colors">论坛</Link></li>
                <li><Link to="/ai" className="text-gray-400 hover:text-white transition-colors">AI开发</Link></li>
                <li><Link to="/publish" className="text-gray-400 hover:text-white transition-colors">游戏发布</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">个人中心</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-5">资源链接</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">API文档</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">服务条款</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">隐私政策</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-5">联系我们</h4>
              <ul className="space-y-3">
                <li className="text-gray-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  support@devrealm.com
                </li>
                <li className="text-gray-400">Discord: DevRealm#1234</li>
                <li className="text-gray-400">Twitter: @DevRealm</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 DevRealm. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-gray-500 hover:text-white transition-colors text-sm">服务条款</Link>
              <Link to="#" className="text-gray-500 hover:text-white transition-colors text-sm">隐私政策</Link>
              <Link to="#" className="text-gray-500 hover:text-white transition-colors text-sm">Cookie设置</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}