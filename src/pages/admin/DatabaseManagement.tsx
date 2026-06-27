import { useState, useEffect } from 'react';
import { 
  Database, Download, Upload, Trash2,
  CheckCircle, AlertTriangle,
  Users, FileText, Gamepad2
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';
import { useGameStore } from '@/store/gameStore';

export default function DatabaseManagement() {
  const { users, initUsers, clearUsers } = useUserStore();
  const { posts, initPosts, clearPosts } = usePostStore();
  const { games, initGames, clearGames } = useGameStore();
  
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'exported'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'imported'>('idle');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearType, setClearType] = useState<'all' | 'users' | 'posts' | 'games'>('all');

  useEffect(() => {
    initUsers();
    initPosts();
    initGames();
  }, []);

  const handleExport = () => {
    setExportStatus('exporting');
    setTimeout(() => {
      const data = {
        users,
        posts,
        games,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devrealm-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('exported');
      setTimeout(() => setExportStatus('idle'), 2000);
    }, 1000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImportStatus('importing');
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.users) {
              localStorage.setItem('devrealm_users', JSON.stringify(data.users));
            }
            if (data.posts) {
              localStorage.setItem('devrealm_posts', JSON.stringify(data.posts));
            }
            if (data.games) {
              localStorage.setItem('devrealm_games', JSON.stringify(data.games));
            }
            setImportStatus('imported');
            setTimeout(() => {
              setImportStatus('idle');
              window.location.reload();
            }, 2000);
          } catch {
            setImportStatus('idle');
            alert('导入失败，文件格式不正确');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (clearType === 'all') {
      localStorage.removeItem('devrealm_users');
      localStorage.removeItem('devrealm_posts');
      localStorage.removeItem('devrealm_games');
      localStorage.removeItem('devrealm_audit_logs');
      localStorage.removeItem('auth-store');
    } else if (clearType === 'users') {
      localStorage.removeItem('devrealm_users');
    } else if (clearType === 'posts') {
      localStorage.removeItem('devrealm_posts');
    } else if (clearType === 'games') {
      localStorage.removeItem('devrealm_games');
    }
    setShowClearConfirm(false);
    window.location.reload();
  };

  const dataStats = [
    { label: '用户数据', value: users.length, icon: Users, type: 'users' },
    { label: '帖子数据', value: posts.length, icon: FileText, type: 'posts' },
    { label: '游戏数据', value: games.length, icon: Gamepad2, type: 'games' },
    { label: '数据总量', value: (users.length + posts.length + games.length), icon: Database, type: 'all' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">数据管理</h1>
          <p className="text-gray-400 mt-1">管理平台的所有数据，包括备份、恢复和清理</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dataStats.map((stat) => (
          <div key={stat.type} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="font-bold text-white">导出数据</h3>
              <p className="text-sm text-gray-400">将所有数据导出为 JSON 文件</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exportStatus !== 'idle'}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              exportStatus === 'exported'
                ? 'bg-green-500 text-white'
                : exportStatus === 'exporting'
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-green-500/15 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {exportStatus === 'exported' ? '导出成功' : exportStatus === 'exporting' ? '导出中...' : '导出全部数据'}
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="font-bold text-white">导入数据</h3>
              <p className="text-sm text-gray-400">从 JSON 文件恢复数据</p>
            </div>
          </div>
          <button
            onClick={handleImport}
            disabled={importStatus !== 'idle'}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              importStatus === 'imported'
                ? 'bg-green-500 text-white'
                : importStatus === 'importing'
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {importStatus === 'imported' ? '导入成功' : importStatus === 'importing' ? '导入中...' : '选择文件导入'}
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="font-bold text-white">清理数据</h3>
              <p className="text-sm text-gray-400">清除平台上的所有数据</p>
            </div>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-3 rounded-xl bg-red-500/15 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
          >
            清空数据
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display text-xl font-bold text-white mb-6">数据详情</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">用户数据</h4>
            <div className="p-4 bg-dark-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">总用户数</span>
                <span className="text-white font-bold">{users.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">管理员</span>
                <span className="text-white">{users.filter(u => u.role === 'admin').length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">VIP会员</span>
                <span className="text-white">{users.filter(u => u.role === 'vip').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">普通用户</span>
                <span className="text-white">{users.filter(u => u.role === 'user').length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">帖子数据</h4>
            <div className="p-4 bg-dark-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">总帖子数</span>
                <span className="text-white font-bold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">已发布</span>
                <span className="text-green-400">{posts.filter(p => p.status === 'published').length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">待审核</span>
                <span className="text-yellow-400">{posts.filter(p => p.status === 'pending').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">已隐藏</span>
                <span className="text-red-400">{posts.filter(p => p.status === 'hidden').length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">游戏数据</h4>
            <div className="p-4 bg-dark-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">总游戏数</span>
                <span className="text-white font-bold">{games.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">已发布</span>
                <span className="text-green-400">{games.filter(g => g.status === 'live').length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">待审核</span>
                <span className="text-yellow-400">{games.filter(g => g.status === 'pending').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">已拒绝</span>
                <span className="text-red-400">{games.filter(g => g.status === 'rejected').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">确认清空</h3>
                <p className="text-gray-400">此操作不可恢复，请谨慎操作</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {(['all', 'users', 'posts', 'games'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setClearType(type)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    clearType === type
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">
                      {type === 'all' && '全部数据'}
                      {type === 'users' && '用户数据'}
                      {type === 'posts' && '帖子数据'}
                      {type === 'games' && '游戏数据'}
                    </span>
                    {clearType === type && (
                      <CheckCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-400 font-medium hover:bg-dark-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}