import { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Edit3, Trash2, Ban, CheckCircle,
  XCircle, Crown, Shield, Star, Mail, Calendar, Download, Upload,
  RefreshCw, MoreVertical, User, Eye, Filter, ChevronDown,
  ChevronUp, Lock, Unlock, Award, BarChart3, MessageSquare,
  Activity, TrendingUp
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAuditStore } from '@/store/auditStore';
import { useAuthStore } from '@/store/authStore';
import { User as UserType } from '@/types';

type UserRole = 'user' | 'vip' | 'expert' | 'admin';

interface ModalState {
  type: 'create' | 'edit' | 'delete' | 'role' | 'detail' | null;
  user?: UserType;
}

export default function UserManagement() {
  const { users, initUsers, createUser, updateUser, deleteUser, toggleBan, updateRole } = useUserStore();
  const { addLog } = useAuditStore();
  const { user: currentUser } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'banned' | ''>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    initUsers();
  }, []);

  useEffect(() => {
    if (modal?.type) {
      if (modal.type === 'create') {
        setFormData({ username: '', email: '', password: '', role: 'user', bio: '' });
      } else if (modal.type === 'edit' && modal.user) {
        setFormData({ ...modal.user });
      }
    }
  }, [modal]);

  const filteredUsers = [...users].filter(user => {
    const matchSearch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = !filterRole || user.role === filterRole;
    const matchStatus = !filterStatus || 
      (filterStatus === 'active' ? !user.is_banned : user.is_banned);
    return matchSearch && matchRole && matchStatus;
  }).sort((a, b) => {
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortConfig.key === 'reputation') {
      return sortConfig.direction === 'asc' ? a.reputation - b.reputation : b.reputation - a.reputation;
    }
    if (sortConfig.key === 'username') {
      return sortConfig.direction === 'asc' 
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username);
    }
    return 0;
  });

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBatchBan = () => {
    selectedUsers.forEach(id => {
      toggleBan(id);
    });
    addLog({
      action: '批量封禁',
      module: '用户管理',
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `批量封禁 ${selectedUsers.length} 个用户`,
    });
    setSelectedUsers([]);
  };

  const handleBatchDelete = () => {
    selectedUsers.forEach(id => {
      deleteUser(id);
    });
    addLog({
      action: '批量删除',
      module: '用户管理',
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `批量删除 ${selectedUsers.length} 个用户`,
    });
    setSelectedUsers([]);
  };

  const handleSaveUser = () => {
    if (modal?.type === 'create') {
      createUser(formData as Omit<UserType, 'id' | 'created_at' | 'updated_at'>);
      addLog({
        action: '创建用户',
        module: '用户管理',
        target_name: formData.username,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `创建用户: ${formData.email}`,
      });
    } else if (modal?.type === 'edit' && modal.user) {
      updateUser(modal.user.id, formData);
      addLog({
        action: '编辑用户',
        module: '用户管理',
        target_id: modal.user.id,
        target_name: modal.user.username,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `编辑用户: ${modal.user.username}`,
      });
    }
    setModal(null);
  };

  const handleDelete = (user: UserType) => {
    deleteUser(user.id);
    addLog({
      action: '删除用户',
      module: '用户管理',
      target_id: user.id,
      target_name: user.username,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `删除用户: ${user.username}`,
    });
    setModal(null);
  };

  const handleToggleBan = (user: UserType) => {
    toggleBan(user.id);
    addLog({
      action: user.is_banned ? '解封用户' : '封禁用户',
      module: '用户管理',
      target_id: user.id,
      target_name: user.username,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `${user.is_banned ? '解封' : '封禁'}用户: ${user.username}`,
    });
  };

  const handleUpdateRole = (user: UserType, role: UserRole) => {
    updateRole(user.id, role);
    addLog({
      action: '更新角色',
      module: '用户管理',
      target_id: user.id,
      target_name: user.username,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `将 ${user.username} 的角色更新为: ${role}`,
    });
    setModal(null);
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const roleConfig = {
    admin: { label: '管理员', color: 'bg-admin-success/15 text-admin-success', icon: Shield },
    vip: { label: 'VIP会员', color: 'bg-admin-warning/15 text-admin-warning', icon: Crown },
    expert: { label: '专家', color: 'bg-admin-secondary/15 text-admin-secondary', icon: Star },
    user: { label: '普通用户', color: 'bg-admin-text-muted/15 text-admin-text-secondary', icon: User },
  };

  const stats = [
    { label: '总用户', value: users.length, icon: Users, color: 'text-admin-primary', bgColor: 'bg-admin-primary/10' },
    { label: '活跃用户', value: users.filter(u => !u.is_banned).length, icon: Activity, color: 'text-admin-success', bgColor: 'bg-admin-success/10' },
    { label: '已封禁', value: users.filter(u => u.is_banned).length, icon: Ban, color: 'text-admin-danger', bgColor: 'bg-admin-danger/10' },
    { label: 'VIP会员', value: users.filter(u => u.role === 'vip').length, icon: Crown, color: 'text-admin-warning', bgColor: 'bg-admin-warning/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">用户管理</h1>
          <p className="text-admin-text-muted mt-2">管理平台所有用户账户和权限</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-dropdown border border-admin-border text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">导出数据</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-dropdown border border-admin-border text-admin-text-secondary hover:text-white hover:bg-admin-hover transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">导入数据</span>
          </button>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-admin-primary to-admin-secondary text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-admin-primary/20"
          >
            <Plus className="w-5 h-5" />
            新增用户
          </button>
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

      {selectedUsers.length > 0 && (
        <div className="admin-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-admin-text-secondary">已选择 <span className="text-white font-bold">{selectedUsers.length}</span> 个用户</span>
            <button
              onClick={handleBatchBan}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-danger/15 text-admin-danger text-sm font-medium hover:bg-admin-danger/20 transition-colors"
            >
              <Ban className="w-4 h-4" />
              批量封禁
            </button>
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-danger text-white text-sm font-medium hover:bg-admin-danger/90 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              批量删除
            </button>
          </div>
          <button
            onClick={() => setSelectedUsers([])}
            className="text-sm text-admin-text-muted hover:text-white transition-colors"
          >
            取消选择
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-admin-dropdown border border-admin-border flex-1 max-w-md">
          <Search className="w-5 h-5 text-admin-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索用户名或邮箱..."
            className="bg-transparent border-none outline-none text-white placeholder-admin-text-muted w-full"
          />
        </div>
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
            className="appearance-none bg-admin-dropdown border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10"
          >
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="vip">VIP会员</option>
            <option value="expert">专家</option>
            <option value="user">普通用户</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'active' | 'banned' | '')}
            className="appearance-none bg-admin-dropdown border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10"
          >
            <option value="">全部状态</option>
            <option value="active">正常用户</option>
            <option value="banned">已封禁</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
        </div>
        <button className="p-2.5 rounded-xl bg-admin-dropdown border border-admin-border text-admin-text-muted hover:text-white hover:bg-admin-hover transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left p-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="w-5 h-5 rounded border-admin-border bg-admin-dropdown text-admin-primary focus:ring-admin-primary"
                    />
                  </label>
                </th>
                <th className="text-left p-4 text-sm font-medium text-admin-text-muted">用户信息</th>
                <th className="text-left p-4 text-sm font-medium text-admin-text-muted">角色</th>
                <th className="text-left p-4 text-sm font-medium text-admin-text-muted">等级 / 声望</th>
                <th className="text-left p-4 text-sm font-medium text-admin-text-muted">注册时间</th>
                <th className="text-left p-4 text-sm font-medium text-admin-text-muted">状态</th>
                <th className="text-right p-4 text-sm font-medium text-admin-text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleConfig[user.role].icon;
                return (
                  <tr 
                    key={user.id} 
                    className={`border-b border-admin-border hover:bg-admin-hover/50 transition-colors ${
                      user.is_banned ? 'bg-admin-danger/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-5 h-5 rounded border-admin-border bg-admin-dropdown text-admin-primary focus:ring-admin-primary"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={user.avatar_url} 
                          alt={user.username} 
                          className="w-12 h-12 rounded-full border-2 border-admin-border"
                        />
                        <div>
                          <p className="font-medium text-white">{user.username}</p>
                          <p className="text-sm text-admin-text-muted flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleConfig[user.role].color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-admin-text-muted">Lv.{user.level}</span>
                        <span className="text-admin-primary">{user.reputation.toLocaleString()} 声望</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-admin-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-admin-danger/15 text-admin-danger">
                          <XCircle className="w-3 h-3" />
                          已封禁
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-admin-success/15 text-admin-success">
                          <CheckCircle className="w-3 h-3" />
                          正常
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ type: 'detail', user })}
                          className="p-2 rounded-lg text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'role', user })}
                          className="p-2 rounded-lg text-admin-text-muted hover:text-admin-warning hover:bg-admin-warning/10 transition-colors"
                          title="修改角色"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'edit', user })}
                          className="p-2 rounded-lg text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_banned 
                              ? 'text-admin-success hover:bg-admin-success/10' 
                              : 'text-admin-danger hover:bg-admin-danger/10'
                          }`}
                          title={user.is_banned ? '解封' : '封禁'}
                        >
                          {user.is_banned ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setModal({ type: 'delete', user })}
                          className="p-2 rounded-lg text-admin-danger hover:bg-admin-danger/10 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="admin-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">
                {modal.type === 'create' && '新增用户'}
                {modal.type === 'edit' && '编辑用户'}
                {modal.type === 'delete' && '确认删除'}
                {modal.type === 'role' && '修改角色'}
                {modal.type === 'detail' && '用户详情'}
              </h3>
              <button onClick={() => setModal(null)} className="text-admin-text-muted hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {modal.type === 'delete' && modal.user && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-admin-danger/10 rounded-xl">
                  <Trash2 className="w-8 h-8 text-admin-danger" />
                  <div>
                    <p className="text-white font-medium">确定要删除用户 {modal.user.username} 吗？</p>
                    <p className="text-admin-text-muted text-sm">此操作不可恢复，该用户的所有数据将被删除</p>
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
                    onClick={() => handleDelete(modal.user)}
                    className="flex-1 py-3 rounded-xl bg-admin-danger text-white font-medium hover:bg-admin-danger/90 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            )}

            {modal.type === 'role' && modal.user && (
              <div className="space-y-4">
                <p className="text-sm text-admin-text-muted">为用户 <span className="text-white font-medium">{modal.user.username}</span> 选择新角色：</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['user', 'vip', 'expert', 'admin'] as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    const Icon = config.icon;
                    return (
                      <button
                        key={role}
                        onClick={() => handleUpdateRole(modal.user!, role)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          modal.user!.role === role
                            ? 'border-admin-primary bg-admin-primary/10'
                            : 'border-admin-border hover:border-admin-primary/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{config.label}</p>
                          <p className="text-xs text-admin-text-muted">点击选择</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {modal.type === 'detail' && modal.user && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-admin-dropdown/50 rounded-xl">
                  <img 
                    src={modal.user.avatar_url} 
                    alt={modal.user.username}
                    className="w-16 h-16 rounded-full border-2 border-admin-primary/30"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{modal.user.username}</h2>
                    <p className="text-admin-text-muted">{modal.user.email}</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-2 ${roleConfig[modal.user.role].color}`}>
                      {roleConfig[modal.user.role].label}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-admin-dropdown/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-admin-warning" />
                      <span className="text-sm text-admin-text-muted">等级</span>
                    </div>
                    <p className="text-2xl font-bold text-white">Lv.{modal.user.level}</p>
                  </div>
                  <div className="p-4 bg-admin-dropdown/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-admin-success" />
                      <span className="text-sm text-admin-text-muted">声望</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{modal.user.reputation.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-admin-dropdown/30 rounded-xl">
                    <span className="text-admin-text-muted">注册时间</span>
                    <span className="text-white">{new Date(modal.user.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-admin-dropdown/30 rounded-xl">
                    <span className="text-admin-text-muted">最后更新</span>
                    <span className="text-white">{new Date(modal.user.updated_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-admin-dropdown/30 rounded-xl">
                    <span className="text-admin-text-muted">状态</span>
                    <span className={modal.user.is_banned ? 'text-admin-danger' : 'text-admin-success'}>
                      {modal.user.is_banned ? '已封禁' : '正常'}
                    </span>
                  </div>
                </div>

                {modal.user.bio && (
                  <div className="p-4 bg-admin-dropdown/30 rounded-xl">
                    <p className="text-sm text-admin-text-muted mb-2">个人简介</p>
                    <p className="text-white">{modal.user.bio}</p>
                  </div>
                )}
              </div>
            )}

            {(modal.type === 'create' || modal.type === 'edit') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-admin-text-secondary">用户名</label>
                  <input
                    type="text"
                    value={(formData as UserType).username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-admin-text-secondary">邮箱</label>
                  <input
                    type="email"
                    value={(formData as UserType).email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                  />
                </div>
                {modal.type === 'create' && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">密码</label>
                    <input
                      type="password"
                      value={(formData as UserType).password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-admin-text-secondary">角色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['user', 'vip', 'expert', 'admin'] as UserRole[]).map((role) => {
                      const config = roleConfig[role];
                      const Icon = config.icon;
                      return (
                        <button
                          key={role}
                          onClick={() => setFormData({ ...formData, role })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            (formData as UserType).role === role
                              ? 'border-admin-primary bg-admin-primary/10'
                              : 'border-admin-border hover:border-admin-primary/50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs text-admin-text-secondary">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-admin-text-secondary">简介</label>
                  <textarea
                    value={(formData as UserType).bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveUser}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-admin-primary to-admin-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  {modal.type === 'create' ? '创建用户' : '保存修改'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}