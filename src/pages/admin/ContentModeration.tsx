import { useState, useEffect } from 'react';
import { 
  FileText, Search, Check, X, Edit3, Trash2, Clock, 
  AlertCircle, Eye, MessageSquare, Tag, Calendar, Heart,
  Gamepad2, ChevronDown, Filter, MoreHorizontal, User,
  ArrowLeft, ArrowRight, CheckCircle2, XCircle2
} from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useGameStore } from '@/store/gameStore';
import { useAuditStore } from '@/store/auditStore';
import { useAuthStore } from '@/store/authStore';
import { Post, Game, Comment } from '@/types';

type ContentTab = 'posts' | 'games' | 'comments';

interface ModalState {
  type: 'view' | 'edit' | 'delete' | null;
  item?: Post | Game;
}

export default function ContentModeration() {
  const { posts, initPosts, updatePost, deletePost, updateStatus: updatePostStatus } = usePostStore();
  const { games, initGames, updateGame, deleteGame, updateStatus: updateGameStatus } = useGameStore();
  const { addLog } = useAuditStore();
  const { user: currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<ContentTab>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'published' | 'hidden' | ''>('');
  const [modal, setModal] = useState<ModalState>(null);
  const [formData, setFormData] = useState<Partial<Post | Game>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    initPosts();
    initGames();
  }, []);

  useEffect(() => {
    if (modal?.type === 'edit' && modal.item) {
      setFormData({ ...modal.item });
    }
    setCurrentPage(1);
  }, [modal]);

  const filteredPosts = posts.filter(post => {
    const matchSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || post.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredGames = games.filter(game => {
    const matchSearch = !searchQuery || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || game.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const mockComments: Comment[] = [
    { id: '1', post_id: '1', user_id: '2', content: '非常实用的内容！期待更多分享。', likes: 23, created_at: '2024-06-20T11:45:00Z' },
    { id: '2', post_id: '1', user_id: '3', content: '同意！Unity 2024的批处理确实改进很多。', likes: 12, created_at: '2024-06-20T12:00:00Z' },
    { id: '3', post_id: '2', user_id: '1', content: '分析得很到位，市场确实在变化。', likes: 18, created_at: '2024-06-18T15:30:00Z' },
  ];

  const pendingPostCount = posts.filter(p => p.status === 'pending').length;
  const pendingGameCount = games.filter(g => g.status === 'pending').length;

  const totalPages = Math.ceil(
    activeTab === 'posts' ? filteredPosts.length / itemsPerPage :
    activeTab === 'games' ? filteredGames.length / itemsPerPage :
    mockComments.length / itemsPerPage
  );

  const handleApprove = (item: Post | Game) => {
    if ('user_id' in item && 'title' in item) {
      updatePostStatus(item.id, 'published');
      addLog({
        action: '审核通过',
        module: '内容审核',
        target_id: item.id,
        target_name: item.title,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `审核通过文章: ${item.title}`,
      });
    } else {
      updateGameStatus(item.id, 'approved');
      addLog({
        action: '审核通过',
        module: '内容审核',
        target_id: item.id,
        target_name: item.name,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `审核通过游戏: ${item.name}`,
      });
    }
  };

  const handleReject = (item: Post | Game) => {
    if ('user_id' in item && 'title' in item) {
      updatePostStatus(item.id, 'hidden');
      addLog({
        action: '审核拒绝',
        module: '内容审核',
        target_id: item.id,
        target_name: item.title,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `拒绝文章: ${item.title}`,
      });
    } else {
      updateGameStatus(item.id, 'rejected');
      addLog({
        action: '审核拒绝',
        module: '内容审核',
        target_id: item.id,
        target_name: item.name,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `拒绝游戏: ${item.name}`,
      });
    }
  };

  const handleSave = () => {
    if (modal?.type === 'edit' && modal.item) {
      if ('user_id' in modal.item && 'title' in modal.item) {
        updatePost(modal.item.id, formData);
        addLog({
          action: '编辑内容',
          module: '内容审核',
          target_id: modal.item.id,
          target_name: modal.item.title,
          user_id: currentUser?.id || '',
          user_name: currentUser?.username || '',
          result: 'success',
          details: `编辑文章: ${modal.item.title}`,
        });
      } else {
        updateGame(modal.item.id, formData);
        addLog({
          action: '编辑游戏',
          module: '内容审核',
          target_id: modal.item.id,
          target_name: modal.item.name,
          user_id: currentUser?.id || '',
          user_name: currentUser?.username || '',
          result: 'success',
          details: `编辑游戏: ${modal.item.name}`,
        });
      }
    }
    setModal(null);
  };

  const handleDelete = (item: Post | Game) => {
    if ('user_id' in item && 'title' in item) {
      deletePost(item.id);
      addLog({
        action: '删除内容',
        module: '内容审核',
        target_id: item.id,
        target_name: item.title,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `删除文章: ${item.title}`,
      });
    } else {
      deleteGame(item.id);
      addLog({
        action: '删除游戏',
        module: '内容审核',
        target_id: item.id,
        target_name: item.name,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `删除游戏: ${item.name}`,
      });
    }
    setModal(null);
  };

  const statusConfig = {
    published: { label: '已发布', color: 'bg-admin-success/15 text-admin-success', icon: CheckCircle2 },
    approved: { label: '已审核', color: 'bg-admin-success/15 text-admin-success', icon: CheckCircle2 },
    pending: { label: '待审核', color: 'bg-admin-warning/15 text-admin-warning', icon: Clock },
    hidden: { label: '已隐藏', color: 'bg-admin-danger/15 text-admin-danger', icon: XCircle2 },
    rejected: { label: '已拒绝', color: 'bg-admin-danger/15 text-admin-danger', icon: XCircle2 },
    live: { label: '已发布', color: 'bg-admin-success/15 text-admin-success', icon: CheckCircle2 },
  };

  const stats = [
    { label: '总内容', value: posts.length + games.length + mockComments.length, icon: FileText, color: 'text-admin-primary', bgColor: 'bg-admin-primary/10' },
    { label: '待审核', value: pendingPostCount + pendingGameCount, icon: Clock, color: 'text-admin-warning', bgColor: 'bg-admin-warning/10' },
    { label: '已发布', value: posts.filter(p => p.status === 'published').length + games.filter(g => g.status === 'live' || g.status === 'approved').length, icon: Check, color: 'text-admin-success', bgColor: 'bg-admin-success/10' },
    { label: '已拒绝', value: posts.filter(p => p.status === 'hidden').length + games.filter(g => g.status === 'rejected').length, icon: X, color: 'text-admin-danger', bgColor: 'bg-admin-danger/10' },
  ];

  const paginatedItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    if (activeTab === 'posts') return filteredPosts.slice(start, end);
    if (activeTab === 'games') return filteredGames.slice(start, end);
    return mockComments.slice(start, end);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">内容审核</h1>
          <p className="text-admin-text-muted mt-2">审核平台上的帖子、游戏和评论内容</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="admin-card p-5">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-sm text-admin-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-1 bg-admin-dropdown rounded-xl w-fit">
        {(['posts', 'games', 'comments'] as ContentTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-admin-bg'
                : 'text-admin-text-secondary hover:text-white'
            }`}
          >
            {tab === 'posts' && <FileText className="w-4 h-4" />}
            {tab === 'games' && <Gamepad2 className="w-4 h-4" />}
            {tab === 'comments' && <MessageSquare className="w-4 h-4" />}
            {tab === 'posts' && '帖子'}
            {tab === 'games' && '游戏'}
            {tab === 'comments' && '评论'}
            {tab === 'posts' && pendingPostCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-admin-danger text-white rounded-full">
                {pendingPostCount}
              </span>
            )}
            {tab === 'games' && pendingGameCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-admin-danger text-white rounded-full">
                {pendingGameCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-admin-dropdown border border-admin-border flex-1 max-w-md">
          <Search className="w-5 h-5 text-admin-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="搜索标题或内容..."
            className="bg-transparent border-none outline-none text-white placeholder-admin-text-muted w-full"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as 'pending' | 'published' | 'hidden' | ''); setCurrentPage(1); }}
            className="appearance-none bg-admin-dropdown border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10"
          >
            <option value="">全部状态</option>
            <option value="pending">待审核</option>
            <option value="published">已发布</option>
            <option value="hidden">已隐藏</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
        </div>
      </div>

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {paginatedItems().map((post) => {
            const StatusIcon = statusConfig[post.status || 'pending'].icon;
            return (
              <div 
                key={post.id}
                className={`admin-card p-6 ${
                  post.status === 'pending' ? 'border-l-4 border-admin-warning' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[post.status || 'pending'].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[post.status || 'pending'].label}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-admin-text-muted/15 text-admin-text-secondary">
                        {post.category}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-admin-primary/10 text-admin-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-admin-text-secondary text-sm line-clamp-2 mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-admin-text-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.user?.username || '未知用户'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.comments_count} 评论
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {post.likes} 点赞
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <button
                      onClick={() => setModal({ type: 'view', item: post })}
                      className="p-2.5 rounded-lg bg-admin-dropdown text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                      title="预览"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setModal({ type: 'edit', item: post })}
                      className="p-2.5 rounded-lg bg-admin-dropdown text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                      title="编辑"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    {post.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(post)}
                          className="p-2.5 rounded-lg bg-admin-success/15 text-admin-success hover:bg-admin-success/20 transition-colors"
                          title="通过"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(post)}
                          className="p-2.5 rounded-lg bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20 transition-colors"
                          title="拒绝"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {post.status !== 'pending' && (
                      <button
                        onClick={() => updatePostStatus(post.id, post.status === 'published' ? 'hidden' : 'published')}
                        className={`p-2.5 rounded-lg transition-colors ${
                          post.status === 'published' 
                            ? 'bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20' 
                            : 'bg-admin-success/15 text-admin-success hover:bg-admin-success/20'
                        }`}
                        title={post.status === 'published' ? '隐藏' : '发布'}
                      >
                        {post.status === 'published' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                    )}
                    <button
                      onClick={() => setModal({ type: 'delete', item: post })}
                      className="p-2.5 rounded-lg bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'games' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems().map((game) => {
            const StatusIcon = statusConfig[game.status].icon;
            return (
              <div 
                key={game.id}
                className={`admin-card overflow-hidden ${
                  game.status === 'pending' ? 'border-l-4 border-admin-warning' : ''
                }`}
              >
                <div className="relative h-48 bg-admin-dropdown overflow-hidden">
                  <img 
                    src={game.cover_image || game.cover_url} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[game.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[game.status].label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 truncate">{game.name}</h3>
                  <p className="text-admin-text-muted text-sm line-clamp-2 mb-3">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-admin-text-muted">{game.developer}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal({ type: 'view', item: game })}
                        className="p-2 rounded-lg text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setModal({ type: 'edit', item: game })}
                        className="p-2 rounded-lg text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                        title="编辑"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {game.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(game)}
                            className="p-2 rounded-lg bg-admin-success/15 text-admin-success hover:bg-admin-success/20 transition-colors"
                            title="通过"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(game)}
                            className="p-2 rounded-lg bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20 transition-colors"
                            title="拒绝"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setModal({ type: 'delete', item: game })}
                        className="p-2 rounded-lg text-admin-danger hover:bg-admin-danger/10 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-4">
          {paginatedItems().map((comment) => (
            <div key={comment.id} className="admin-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-admin-icon-bg flex items-center justify-center text-lg font-bold text-admin-primary">
                  U
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-white">用户{comment.user_id}</span>
                    <span className="text-sm text-admin-text-muted">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-admin-text-secondary">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-sm text-admin-text-muted">
                      <Heart className="w-4 h-4" />
                      {comment.likes}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-lg bg-admin-success/15 text-admin-success hover:bg-admin-success/20 transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-lg bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-admin-primary text-white'
                  : 'text-admin-text-muted hover:text-white hover:bg-admin-hover'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="admin-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {modal.type === 'view' && '预览内容'}
                {modal.type === 'edit' && '编辑内容'}
                {modal.type === 'delete' && '确认删除'}
              </h3>
              <button onClick={() => setModal(null)} className="text-admin-text-muted hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modal.type === 'delete' && modal.item && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-admin-danger/10 rounded-xl">
                  <Trash2 className="w-8 h-8 text-admin-danger" />
                  <div>
                    <p className="text-white font-medium">确定要删除 {modal.item.title || modal.item.name} 吗？</p>
                    <p className="text-admin-text-muted text-sm">此操作不可恢复</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-3 rounded-xl bg-admin-dropdown text-admin-text-secondary font-medium hover:bg-admin-hover transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDelete(modal.item)}
                    className="flex-1 py-3 rounded-xl bg-admin-danger text-white font-medium hover:bg-admin-danger/90 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            )}

            {(modal.type === 'view' || modal.type === 'edit') && modal.item && (
              <div className="space-y-4">
                {modal.type === 'view' ? (
                  <div>
                    {('cover_image' in modal.item) && modal.item.cover_image && (
                      <div className="h-48 rounded-xl overflow-hidden bg-admin-dropdown mb-4">
                        <img 
                          src={modal.item.cover_image} 
                          alt={modal.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[modal.item.status || 'pending'].color}`}>
                        {statusConfig[modal.item.status || 'pending'].label}
                      </span>
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-admin-text-muted/15 text-admin-text-secondary">
                        {'category' in modal.item ? modal.item.category : ''}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{modal.item.title || modal.item.name}</h2>
                    <div className="text-admin-text-secondary whitespace-pre-wrap">
                      {'content' in modal.item ? modal.item.content : modal.item.description}
                    </div>
                    {'tags' in modal.item && modal.item.tags && modal.item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {modal.item.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full text-sm bg-admin-primary/10 text-admin-primary">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-admin-text-secondary">标题</label>
                      <input
                        type="text"
                        value={formData.title || (formData as Game).name || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-admin-text-secondary">分类</label>
                      <input
                        type="text"
                        value={(formData as Post).category || (formData as Game).genre || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, genre: e.target.value })}
                        className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-admin-text-secondary">内容</label>
                      <textarea
                        value={(formData as Post).content || (formData as Game).description || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value, description: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors resize-none"
                      />
                    </div>
                    {('tags' in formData) && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-admin-text-secondary">标签（用逗号分隔）</label>
                        <input
                          type="text"
                          value={(formData as Post).tags?.join(', ') || ''}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                        />
                      </div>
                    )}
                    <button
                      onClick={handleSave}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-admin-primary to-admin-secondary text-white font-medium hover:opacity-90 transition-all"
                    >
                      保存修改
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}