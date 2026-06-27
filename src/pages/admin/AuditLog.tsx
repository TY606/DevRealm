import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, RefreshCw, Clock,
  User, FileText, Settings, Shield, Database,
  ChevronDown, ChevronRight, ChevronLeft,
  CheckCircle2, XCircle2, AlertCircle,
  Eye, Calendar, Tag
} from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';
import { AuditLog as AuditLogType } from '@/types';

type FilterTab = 'all' | 'user' | 'content' | 'security' | 'system';

const moduleConfig = {
  '用户管理': { icon: User, color: 'bg-admin-primary/15 text-admin-primary' },
  '内容审核': { icon: FileText, color: 'bg-admin-secondary/15 text-admin-secondary' },
  '安全中心': { icon: Shield, color: 'bg-admin-danger/15 text-admin-danger' },
  '系统设置': { icon: Settings, color: 'bg-admin-warning/15 text-admin-warning' },
  '备份管理': { icon: Database, color: 'bg-admin-success/15 text-admin-success' },
};

const actionTypeConfig: Record<string, { label: string; color: string }> = {
  '创建用户': { label: '创建', color: 'bg-admin-success/15 text-admin-success' },
  '编辑用户': { label: '编辑', color: 'bg-admin-primary/15 text-admin-primary' },
  '删除用户': { label: '删除', color: 'bg-admin-danger/15 text-admin-danger' },
  '更改角色': { label: '角色变更', color: 'bg-admin-warning/15 text-admin-warning' },
  '封禁用户': { label: '封禁', color: 'bg-admin-danger/15 text-admin-danger' },
  '解封用户': { label: '解封', color: 'bg-admin-success/15 text-admin-success' },
  '审核通过': { label: '审核通过', color: 'bg-admin-success/15 text-admin-success' },
  '审核拒绝': { label: '审核拒绝', color: 'bg-admin-danger/15 text-admin-danger' },
  '编辑内容': { label: '编辑', color: 'bg-admin-primary/15 text-admin-primary' },
  '删除内容': { label: '删除', color: 'bg-admin-danger/15 text-admin-danger' },
  '封禁IP': { label: '封禁IP', color: 'bg-admin-danger/15 text-admin-danger' },
  '解封IP': { label: '解封IP', color: 'bg-admin-success/15 text-admin-success' },
  '保存设置': { label: '设置', color: 'bg-admin-warning/15 text-admin-warning' },
  '创建备份': { label: '备份', color: 'bg-admin-success/15 text-admin-success' },
};

export default function AuditLog() {
  const { logs, initLogs, clearLogs } = useAuditStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  useEffect(() => {
    initLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchSearch = !searchQuery || 
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchModule = !filterModule || log.module === filterModule;
    const matchAction = !filterAction || log.action === filterAction;
    const matchDate = !filterDate || log.timestamp.includes(filterDate);
    const matchResult = !filterResult || log.result === filterResult;
    
    const matchFilterTab = activeFilter === 'all' || 
      (activeFilter === 'user' && log.module === '用户管理') ||
      (activeFilter === 'content' && log.module === '内容审核') ||
      (activeFilter === 'security' && log.module === '安全中心') ||
      (activeFilter === 'system' && (log.module === '系统设置' || log.module === '备份管理'));
    
    return matchSearch && matchModule && matchAction && matchDate && matchResult && matchFilterTab;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueModules = [...new Set(logs.map(log => log.module))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  const stats = [
    { label: '今日操作', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: Clock },
    { label: '成功操作', value: logs.filter(l => l.result === 'success').length, icon: CheckCircle2 },
    { label: '失败操作', value: logs.filter(l => l.result === 'failed').length, icon: XCircle2 },
    { label: '警告操作', value: logs.filter(l => l.result === 'warning').length, icon: AlertCircle },
  ];

  const handleClearLogs = () => {
    if (confirm('确定要清空所有操作日志吗？')) {
      clearLogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">操作日志</h1>
          <p className="text-admin-text-muted mt-2">追踪和审查所有管理员操作记录</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-dropdown border border-admin-border text-admin-text-secondary hover:text-white transition-colors">
            <Download className="w-5 h-5" />
            导出日志
          </button>
          <button 
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-danger/15 text-admin-danger hover:bg-admin-danger/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            清空日志
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="admin-card p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stat.icon === CheckCircle2 ? 'bg-admin-success/10' :
              stat.icon === XCircle2 ? 'bg-admin-danger/10' :
              stat.icon === AlertCircle ? 'bg-admin-warning/10' :
              'bg-admin-primary/10'
            }`}>
              <stat.icon className={`w-6 h-6 ${
                stat.icon === CheckCircle2 ? 'text-admin-success' :
                stat.icon === XCircle2 ? 'text-admin-danger' :
                stat.icon === AlertCircle ? 'text-admin-warning' :
                'text-admin-primary'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-sm text-admin-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-1 bg-admin-dropdown rounded-xl w-fit">
        {(['all', 'user', 'content', 'security', 'system'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveFilter(tab); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === tab
                ? 'bg-white text-admin-bg'
                : 'text-admin-text-secondary hover:text-white'
            }`}
          >
            {tab === 'all' && <Filter className="w-4 h-4" />}
            {tab === 'user' && <User className="w-4 h-4" />}
            {tab === 'content' && <FileText className="w-4 h-4" />}
            {tab === 'security' && <Shield className="w-4 h-4" />}
            {tab === 'system' && <Settings className="w-4 h-4" />}
            {tab === 'all' && '全部'}
            {tab === 'user' && '用户管理'}
            {tab === 'content' && '内容审核'}
            {tab === 'security' && '安全中心'}
            {tab === 'system' && '系统设置'}
          </button>
        ))}
      </div>

      <div className="admin-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-admin-bg border border-admin-border flex-1 max-w-md">
            <Search className="w-5 h-5 text-admin-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="搜索用户名、目标或详情..."
              className="bg-transparent border-none outline-none text-white placeholder-admin-text-muted w-full"
            />
          </div>
          
          <div className="relative">
            <select
              value={filterModule}
              onChange={(e) => { setFilterModule(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-admin-bg border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10 min-w-[140px]"
            >
              <option value="">全部模块</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-admin-bg border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10 min-w-[140px]"
            >
              <option value="">全部操作</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterResult}
              onChange={(e) => { setFilterResult(e.target.value); setCurrentPage(1); }}
              className="appearance-none bg-admin-bg border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10 min-w-[120px]"
            >
              <option value="">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="warning">警告</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
          </div>

          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
              className="bg-admin-bg border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">时间</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作人</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">模块</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">目标</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">结果</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => {
                const ModuleIcon = moduleConfig[log.module as keyof typeof moduleConfig]?.icon || FileText;
                const moduleStyle = moduleConfig[log.module as keyof typeof moduleConfig]?.color || 'bg-admin-text-muted/15 text-admin-text-muted';
                const actionConfig = actionTypeConfig[log.action] || { label: log.action, color: 'bg-admin-text-muted/15 text-admin-text-muted' };
                
                return (
                  <tr 
                    key={log.id} 
                    className="border-b border-admin-border/50 hover:bg-admin-hover/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-admin-text-muted" />
                        <span className="text-admin-text-secondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-admin-icon-bg flex items-center justify-center text-sm font-medium text-admin-primary">
                          {log.user_name[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{log.user_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${moduleStyle}`}>
                        <ModuleIcon className="w-3 h-3" />
                        {log.module}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${actionConfig.color}`}>
                        {actionConfig.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-admin-text-muted" />
                        <span className="text-admin-text-secondary">{log.target_name || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        log.result === 'success' ? 'bg-admin-success/15 text-admin-success' :
                        log.result === 'failed' ? 'bg-admin-danger/15 text-admin-danger' :
                        'bg-admin-warning/15 text-admin-warning'
                      }`}>
                        {log.result === 'success' ? <CheckCircle2 className="w-3 h-3" /> :
                         log.result === 'failed' ? <XCircle2 className="w-3 h-3" /> :
                         <AlertCircle className="w-3 h-3" />}
                        {log.result === 'success' ? '成功' : log.result === 'failed' ? '失败' : '警告'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-admin-primary hover:bg-admin-primary/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedLogs.length > 0 && paginatedLogs.some(log => showDetails === log.id) && (
          <div className="border-t border-admin-border">
            {paginatedLogs.map((log) => showDetails === log.id && (
              <div key={log.id} className="p-4 bg-admin-bg/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-admin-text-muted mb-1">操作详情</p>
                    <p className="text-white">{log.details}</p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-muted mb-1">操作人ID</p>
                    <p className="text-white font-mono">{log.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-muted mb-1">目标ID</p>
                    <p className="text-white font-mono">{log.target_id || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-muted mb-1">操作时间</p>
                    <p className="text-white">{new Date(log.timestamp).toISOString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-admin-text-muted">
            显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLogs.length)} 条，共 {filteredLogs.length} 条
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (currentPage > totalPages - 2) {
                page = totalPages - 4 + i;
              } else if (currentPage > 2) {
                page = currentPage - 2 + i;
              }
              if (page < 1) page = 1;
              return (
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
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {filteredLogs.length === 0 && (
        <div className="admin-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-admin-text-muted/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-admin-text-muted" />
          </div>
          <p className="text-white font-medium mb-2">暂无操作日志</p>
          <p className="text-admin-text-muted">没有找到符合条件的操作记录</p>
        </div>
      )}
    </div>
  );
}