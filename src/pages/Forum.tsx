import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Filter, Star, MessageSquare, Clock, Tag, Code, Gamepad2, Palette, TrendingUp, Briefcase, Send, ChevronLeft, ExternalLink, Globe, Heart, Bookmark, Share2 } from 'lucide-react';
import { mockPosts, mockComments, mockCategories, mockUsers } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';

export default function Forum() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    if (sortBy === 'comments') {
      return b.comments_count - a.comments_count;
    }
    return 0;
  });

  const post = id ? mockPosts.find((p) => p.id === id) : null;
  const postComments = id ? mockComments.filter((c) => c.post_id === id) : [];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  if (post) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/forum" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <ChevronLeft className="w-5 h-5" />
              <span>返回论坛</span>
            </Link>
            <button
              onClick={() => setShowBrowser(!showBrowser)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-white hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              站内浏览器
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card p-8 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={post.user?.avatar_url}
                    alt={post.user?.username}
                    className="w-14 h-14 rounded-full border-2 border-white/10"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-lg text-white">{post.user?.username}</h4>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                        {post.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('zh-CN')} · 阅读时间 5分钟
                    </p>
                  </div>
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 text-white">{post.title}</h1>

                <div className="prose prose-invert max-w-none text-gray-300">
                  {post.content.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold text-primary mt-8 mb-3">{line.slice(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-bold mt-6 mb-2">{line.slice(4)}</h3>;
                    }
                    if (line.startsWith('```')) {
                      return (
                        <div key={index} className="bg-dark-800 rounded-xl p-5 font-mono text-sm overflow-x-auto my-6 border border-white/5">
                          <pre className="text-gray-300">{line.slice(3)}</pre>
                        </div>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return <li key={index} className="ml-6 text-gray-300">{line.slice(2)}</li>;
                    }
                    return <p key={index} className="leading-relaxed mb-4">{line}</p>;
                  })}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors group">
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-secondary transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.comments_count}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                      <Bookmark className="w-5 h-5" />
                      <span>收藏</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>分享</span>
                    </button>
                  </div>
                  <span className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>阅读时间 5分钟</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dark-700/50 text-gray-300 border border-white/5 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  评论 ({postComments.length})
                </h3>

                <div className="space-y-5">
                  {postComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors">
                      <img
                        src={comment.user?.avatar_url}
                        alt={comment.user?.username}
                        className="w-10 h-10 rounded-full flex-shrink-0 border border-white/10"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">{comment.user?.username}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors">
                            <Heart className="w-4 h-4" />
                            {comment.likes}
                          </button>
                          {isAuthenticated && (
                            <button className="text-sm text-gray-400 hover:text-primary transition-colors">
                              回复
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="写下你的评论..."
                      className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary resize-none h-24 text-white placeholder-gray-500"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSubmitComment}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                      >
                        <Send className="w-4 h-4" />
                        发表评论
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  分类导航
                </h3>
                <div className="space-y-2">
                  {mockCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category.name ? '' : category.name);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedCategory === category.name
                          ? 'bg-primary/15 border border-primary/30'
                          : 'hover:bg-white/3'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '15' }}
                      >
                        {category.icon === 'Code' && <Code className="w-5 h-5" style={{ color: category.color }} />}
                        {category.icon === 'Gamepad2' && <Gamepad2 className="w-5 h-5" style={{ color: category.color }} />}
                        {category.icon === 'Palette' && <Palette className="w-5 h-5" style={{ color: category.color }} />}
                        {category.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5" style={{ color: category.color }} />}
                        {category.icon === 'Briefcase' && <Briefcase className="w-5 h-5" style={{ color: category.color }} />}
                        {category.icon === 'MessageSquare' && <MessageSquare className="w-5 h-5" style={{ color: category.color }} />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.count} 帖子</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-secondary" />
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Unity', 'Unreal', 'Godot', '像素画', '独立游戏', 'AI', '性能优化', 'UI设计'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-sm bg-dark-700/50 text-gray-300 border border-white/5 hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  活跃用户
                </h3>
                <div className="space-y-3">
                  {mockUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors">
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border border-white/10"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{user.username}</p>
                        <p className="text-xs text-gray-500">Lv.{user.level} · {user.reputation} 声望</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showBrowser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <div className="w-full max-w-4xl glass-card rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
                <div className="flex items-center gap-3 p-4 bg-dark-700/80 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex items-center gap-3 bg-dark-900/50 rounded-lg px-4 py-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={browserUrl}
                      onChange={(e) => setBrowserUrl(e.target.value)}
                      placeholder="输入网址或搜索..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white"
                    />
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowBrowser(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <span className="text-lg text-gray-400">&times;</span>
                  </button>
                </div>
                <div className="h-[550px] bg-dark-900">
                  {browserUrl ? (
                    <iframe
                      src={browserUrl.startsWith('http') ? browserUrl : `https://www.bing.com/search?q=${encodeURIComponent(browserUrl)}`}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Globe className="w-16 h-16 mb-4 opacity-30" />
                      <p className="text-lg">输入网址或搜索关键词开始浏览</p>
                      <p className="text-sm mt-2">支持站内外搜索</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">游戏开发论坛</h1>
            <p className="text-gray-400">与全球开发者交流技术、分享经验</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Send className="w-5 h-5" />
              发布新帖
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ${
              searchFocused ? 'bg-dark-700 border border-primary/30 shadow-lg shadow-primary/10' : 'bg-dark-700/50 border border-white/5'
            }`}>
              <Search className={`w-5 h-5 transition-colors ${searchFocused ? 'text-primary' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="搜索帖子标题或内容..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
            >
              <option value="">全部分类</option>
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最热门</option>
              <option value="comments">评论最多</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {sortedPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/forum/${post.id}`}
                  className="glass-card p-6 hover-lift group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <img
                      src={post.user?.avatar_url}
                      alt={post.user?.username}
                      className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white/5 group-hover:border-primary/30 transition-colors"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-accent transition-colors">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-secondary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments_count}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            5分钟阅读
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-dark-700/50 text-gray-400 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {sortedPosts.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">没有找到相关帖子</p>
                <p className="text-gray-500 text-sm mt-2">试试其他关键词或浏览全部分类</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                分类导航
              </h3>
              <div className="space-y-2">
                {mockCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      selectedCategory === category.name
                        ? 'bg-primary/15 border border-primary/30'
                        : 'hover:bg-white/3'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '15' }}
                    >
                      {category.icon === 'Code' && <Code className="w-5 h-5" style={{ color: category.color }} />}
                      {category.icon === 'Gamepad2' && <Gamepad2 className="w-5 h-5" style={{ color: category.color }} />}
                      {category.icon === 'Palette' && <Palette className="w-5 h-5" style={{ color: category.color }} />}
                      {category.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5" style={{ color: category.color }} />}
                      {category.icon === 'Briefcase' && <Briefcase className="w-5 h-5" style={{ color: category.color }} />}
                      {category.icon === 'MessageSquare' && <MessageSquare className="w-5 h-5" style={{ color: category.color }} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.count} 帖子</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                热门标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Unity', 'Unreal', 'Godot', '像素画', '独立游戏', 'AI', '性能优化', 'UI设计'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-sm bg-dark-700/50 text-gray-300 border border-white/5 hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                活跃用户
              </h3>
              <div className="space-y-3">
                {mockUsers.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors">
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border border-white/10"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">{user.username}</p>
                      <p className="text-xs text-gray-500">Lv.{user.level} · {user.reputation} 声望</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-2xl glass-card rounded-2xl p-8 animate-scale-in shadow-2xl">
              <h2 className="font-display text-2xl font-bold mb-6">发布新帖</h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">标题</label>
                  <input
                    type="text"
                    placeholder="输入帖子标题"
                    className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">分类</label>
                  <select className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white">
                    {mockCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">内容</label>
                  <textarea
                    placeholder="输入帖子内容，支持 Markdown"
                    rows={8}
                    className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary resize-none text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">标签</label>
                  <input
                    type="text"
                    placeholder="输入标签，用逗号分隔"
                    className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    发布帖子
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}