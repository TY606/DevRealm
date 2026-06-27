import { useState, useEffect } from 'react';
import { 
  Gamepad2, Search, Plus, Edit3, Trash2, Check, X, Eye, 
  Clock, AlertCircle, Download, Upload, Calendar, Users, Star
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useAuditStore } from '@/store/auditStore';
import { useAuthStore } from '@/store/authStore';
import { Game } from '@/types';

interface ModalState {
  type: 'create' | 'view' | 'edit' | 'delete' | null;
  game?: Game;
}

export default function GameManagement() {
  const { games, initGames, createGame, updateGame, deleteGame, updateStatus } = useGameStore();
  const { addLog } = useAuditStore();
  const { user: currentUser } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'live' | ''>('');
  const [modal, setModal] = useState<ModalState>(null);
  const [formData, setFormData] = useState<Partial<Game>>({});

  useEffect(() => {
    initGames();
  }, []);

  useEffect(() => {
    if (modal?.type === 'create') {
      setFormData({ name: '', description: '', developer: '', cover_image: '', status: 'pending' });
    } else if (modal?.type === 'edit' && modal.game) {
      setFormData({ ...modal.game });
    }
  }, [modal]);

  const filteredGames = games.filter(game => {
    const matchSearch = !searchQuery || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || game.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (game: Game) => {
    updateStatus(game.id, 'approved');
    addLog({
      action: '审核通过',
      module: '游戏管理',
      target_id: game.id,
      target_name: game.name,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `审核通过游戏: ${game.name}`,
    });
  };

  const handleReject = (game: Game) => {
    updateStatus(game.id, 'rejected');
    addLog({
      action: '审核拒绝',
      module: '游戏管理',
      target_id: game.id,
      target_name: game.name,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `拒绝游戏: ${game.name}`,
    });
  };

  const handlePublish = (game: Game) => {
    updateStatus(game.id, 'live');
    addLog({
      action: '发布游戏',
      module: '游戏管理',
      target_id: game.id,
      target_name: game.name,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `发布游戏: ${game.name}`,
    });
  };

  const handleSaveGame = () => {
    if (modal?.type === 'create') {
      createGame(formData as Omit<Game, 'id' | 'created_at' | 'updated_at'>);
      addLog({
        action: '创建游戏',
        module: '游戏管理',
        target_name: formData.name,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `创建游戏: ${formData.name}`,
      });
    } else if (modal?.type === 'edit' && modal.game) {
      updateGame(modal.game.id, formData);
      addLog({
        action: '编辑游戏',
        module: '游戏管理',
        target_id: modal.game.id,
        target_name: modal.game.name,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `编辑游戏: ${modal.game.name}`,
      });
    }
    setModal(null);
  };

  const handleDelete = (game: Game) => {
    deleteGame(game.id);
    addLog({
      action: '删除游戏',
      module: '游戏管理',
      target_id: game.id,
      target_name: game.name,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `删除游戏: ${game.name}`,
    });
    setModal(null);
  };

  const statusConfig = {
    live: { label: '已发布', color: 'bg-green-500/15 text-green-400', icon: Check },
    approved: { label: '已审核', color: 'bg-blue-500/15 text-blue-400', icon: Check },
    pending: { label: '待审核', color: 'bg-yellow-500/15 text-yellow-400', icon: Clock },
    rejected: { label: '已拒绝', color: 'bg-red-500/15 text-red-400', icon: AlertCircle },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">游戏管理</h1>
          <p className="text-gray-400 mt-1">管理平台上的游戏资源和下载</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 border border-white/10 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">导出数据</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 border border-white/10 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">导入数据</span>
          </button>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            新增游戏
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-dark-700/50 border border-white/5 flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索游戏名称..."
            className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'pending' | 'approved' | 'rejected' | 'live' | '')}
          className="bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 outline-none text-white text-sm"
        >
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已审核</option>
          <option value="live">已发布</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => {
          const StatusIcon = statusConfig[game.status || 'pending'].icon;
          return (
            <div 
              key={game.id}
              className={`glass-card overflow-hidden hover-lift ${
                game.status === 'pending' ? 'border-yellow-500/30' : ''
              }`}
            >
              <div className="relative h-40 bg-dark-700/50 overflow-hidden">
                <img 
                  src={game.cover_image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[game.status || 'pending'].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[game.status || 'pending'].label}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1 truncate">{game.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{game.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Users className="w-3.5 h-3.5" />
                  <span>{game.download_count || 0} 下载</span>
                  <Star className="w-3.5 h-3.5 ml-2" />
                  <span>{game.rating || 0} 评分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{game.developer}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setModal({ type: 'view', game })}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="预览"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setModal({ type: 'edit', game })}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="编辑"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {game.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(game)}
                          className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/20 transition-colors"
                          title="通过"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(game)}
                          className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="拒绝"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {game.status === 'approved' && (
                      <button
                        onClick={() => handlePublish(game)}
                        className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/20 transition-colors"
                        title="发布"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {game.status === 'live' && (
                      <button
                        onClick={() => updateStatus(game.id, 'approved')}
                        className="p-2 rounded-lg bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                        title="下架"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setModal({ type: 'delete', game })}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
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

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {modal.type === 'create' && '新增游戏'}
                {modal.type === 'view' && '游戏详情'}
                {modal.type === 'edit' && '编辑游戏'}
                {modal.type === 'delete' && '确认删除'}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modal.type === 'delete' && modal.game && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl">
                  <Trash2 className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-white font-medium">确定要删除游戏 {modal.game.name} 吗？</p>
                    <p className="text-gray-400 text-sm">此操作不可恢复</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-400 font-medium hover:bg-dark-600 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDelete(modal.game)}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            )}

            {(modal.type === 'view' && modal.game) && (
              <div className="space-y-4">
                <div className="h-48 rounded-xl overflow-hidden bg-dark-700/50">
                  <img 
                    src={modal.game.cover_image} 
                    alt={modal.game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{modal.game.name}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[modal.game.status || 'pending'].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[modal.game.status || 'pending'].label}
                    </span>
                    <span className="text-sm text-gray-400">{modal.game.developer}</span>
                  </div>
                  <p className="text-gray-300">{modal.game.description}</p>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-2xl font-bold text-white">{modal.game.download_count || 0}</p>
                      <p className="text-sm text-gray-500">下载量</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{modal.game.rating || 0}</p>
                      <p className="text-sm text-gray-500">评分</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(modal.type === 'create' || modal.type === 'edit') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">游戏名称</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">开发商</label>
                  <input
                    type="text"
                    value={formData.developer || ''}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">封面图片 URL</label>
                  <input
                    type="text"
                    value={formData.cover_image || ''}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">描述</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveGame}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  {modal.type === 'create' ? '创建游戏' : '保存修改'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}