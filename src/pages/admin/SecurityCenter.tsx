import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, XCircle2, 
  Clock, User, Lock, Key, IP, History, TrendingUp,
  Filter, Search, Ban, Unban, RefreshCw, Download,
  Eye, AlertCircle, Zap, ShieldAlert, ShieldCheck,
  Activity, Wifi, WifiOff, ChevronRight, ChevronDown,
  Fingerprint, FileText
} from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';
import { useAuthStore } from '@/store/authStore';

interface LoginLog {
  id: string;
  user_id: string;
  username: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  status: 'success' | 'failed';
  timestamp: string;
  risk_level: 'low' | 'medium' | 'high';
}

interface IPBlock {
  id: string;
  ip: string;
  reason: string;
  blocked_at: string;
  expires_at: string;
  blocked_by: string;
}

interface Anomaly {
  id: string;
  type: 'brute_force' | 'suspicious_activity' | 'data_leak' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  status: 'pending' | 'resolved' | 'false_positive';
  source_ip: string;
  user_id?: string;
  username?: string;
}

type SecurityTab = 'overview' | 'login_logs' | 'ip_blocking' | 'anomalies';

export default function SecurityCenter() {
  const { addLog } = useAuditStore();
  const { user: currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<SecurityTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const mockLoginLogs: LoginLog[] = [
    { id: '1', user_id: '1', username: 'admin', ip: '192.168.1.100', location: '北京市', device: 'Windows PC', browser: 'Chrome', status: 'success', timestamp: '2024-06-20T09:30:00Z', risk_level: 'low' },
    { id: '2', user_id: '2', username: 'developer1', ip: '10.0.0.50', location: '上海市', device: 'MacBook', browser: 'Safari', status: 'success', timestamp: '2024-06-20T08:15:00Z', risk_level: 'low' },
    { id: '3', user_id: '3', username: 'guest', ip: '172.16.0.200', location: '广州市', device: 'iPhone', browser: 'Safari', status: 'failed', timestamp: '2024-06-20T07:45:00Z', risk_level: 'medium' },
    { id: '4', user_id: '4', username: 'tester', ip: '192.168.0.150', location: '深圳市', device: 'Android', browser: 'Chrome', status: 'success', timestamp: '2024-06-20T06:30:00Z', risk_level: 'low' },
    { id: '5', user_id: '5', username: 'new_user', ip: '203.0.113.45', location: '海外', device: 'Unknown', browser: 'Unknown', status: 'failed', timestamp: '2024-06-20T05:20:00Z', risk_level: 'high' },
    { id: '6', user_id: '6', username: 'moderator', ip: '192.168.1.101', location: '北京市', device: 'Windows PC', browser: 'Firefox', status: 'success', timestamp: '2024-06-20T04:10:00Z', risk_level: 'low' },
    { id: '7', user_id: '7', username: 'expert_user', ip: '10.0.0.51', location: '上海市', device: 'iPad', browser: 'Safari', status: 'success', timestamp: '2024-06-20T03:55:00Z', risk_level: 'low' },
    { id: '8', user_id: '8', username: 'vip_user', ip: '172.16.0.201', location: '广州市', device: 'Android', browser: 'Edge', status: 'failed', timestamp: '2024-06-20T02:40:00Z', risk_level: 'medium' },
    { id: '9', user_id: '9', username: 'normal_user', ip: '192.168.0.151', location: '深圳市', device: 'Windows PC', browser: 'Chrome', status: 'success', timestamp: '2024-06-20T01:25:00Z', risk_level: 'low' },
    { id: '10', user_id: '10', username: 'anonymous', ip: '198.51.100.23', location: '海外', device: 'Unknown', browser: 'Unknown', status: 'failed', timestamp: '2024-06-20T00:10:00Z', risk_level: 'high' },
  ];

  const mockIPBlocks: IPBlock[] = [
    { id: '1', ip: '198.51.100.23', reason: '暴力破解尝试', blocked_at: '2024-06-19T14:30:00Z', expires_at: '2024-06-26T14:30:00Z', blocked_by: 'admin' },
    { id: '2', ip: '203.0.113.45', reason: '异常登录模式', blocked_at: '2024-06-18T09:15:00Z', expires_at: '2024-06-25T09:15:00Z', blocked_by: 'admin' },
    { id: '3', ip: '192.0.2.100', reason: '恶意请求', blocked_at: '2024-06-17T16:45:00Z', expires_at: '2024-06-24T16:45:00Z', blocked_by: 'admin' },
    { id: '4', ip: '172.16.0.255', reason: '批量注册', blocked_at: '2024-06-16T11:20:00Z', expires_at: '2024-06-23T11:20:00Z', blocked_by: 'admin' },
    { id: '5', ip: '10.0.0.99', reason: '数据泄露风险', blocked_at: '2024-06-15T08:00:00Z', expires_at: '2024-06-22T08:00:00Z', blocked_by: 'admin' },
  ];

  const mockAnomalies: Anomaly[] = [
    { id: '1', type: 'brute_force', severity: 'high', description: '检测到来自IP 198.51.100.23的暴力破解尝试，已连续失败20次', detected_at: '2024-06-20T10:30:00Z', status: 'resolved', source_ip: '198.51.100.23', user_id: '10', username: 'anonymous' },
    { id: '2', type: 'suspicious_activity', severity: 'medium', description: '用户guest在短时间内频繁切换IP地址', detected_at: '2024-06-20T08:15:00Z', status: 'pending', source_ip: '172.16.0.200', user_id: '3', username: 'guest' },
    { id: '3', type: 'privilege_escalation', severity: 'critical', description: '检测到尝试提升权限的操作，用户尝试访问管理员功能', detected_at: '2024-06-19T15:45:00Z', status: 'resolved', source_ip: '10.0.0.50', user_id: '2', username: 'developer1' },
    { id: '4', type: 'data_leak', severity: 'high', description: '检测到异常的数据导出请求，可能存在数据泄露风险', detected_at: '2024-06-19T12:30:00Z', status: 'resolved', source_ip: '192.168.1.100', user_id: '1', username: 'admin' },
    { id: '5', type: 'suspicious_activity', severity: 'low', description: '用户新注册后立即尝试登录多次', detected_at: '2024-06-18T20:00:00Z', status: 'false_positive', source_ip: '203.0.113.45', user_id: '5', username: 'new_user' },
    { id: '6', type: 'brute_force', severity: 'medium', description: '检测到来自IP 172.16.0.201的多次登录失败', detected_at: '2024-06-18T17:30:00Z', status: 'pending', source_ip: '172.16.0.201', user_id: '8', username: 'vip_user' },
    { id: '7', type: 'suspicious_activity', severity: 'low', description: '检测到异常的API调用频率', detected_at: '2024-06-17T14:20:00Z', status: 'resolved', source_ip: '192.168.0.150', user_id: '4', username: 'tester' },
    { id: '8', type: 'data_leak', severity: 'critical', description: '检测到大量数据查询请求，可能存在数据抓取行为', detected_at: '2024-06-17T10:00:00Z', status: 'resolved', source_ip: '192.0.2.100', user_id: '7', username: 'expert_user' },
  ];

  const securityScore = 87;
  const threatLevel = securityScore >= 80 ? 'safe' : securityScore >= 50 ? 'warning' : 'danger';

  const securityStats = [
    { label: '安全评分', value: `${securityScore}%`, icon: Shield, color: threatLevel === 'safe' ? 'text-admin-success' : threatLevel === 'warning' ? 'text-admin-warning' : 'text-admin-danger', bgColor: threatLevel === 'safe' ? 'bg-admin-success/10' : threatLevel === 'warning' ? 'bg-admin-warning/10' : 'bg-admin-danger/10' },
    { label: '今日登录', value: mockLoginLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: Login, color: 'text-admin-primary', bgColor: 'bg-admin-primary/10' },
    { label: '拦截攻击', value: mockIPBlocks.length, icon: ShieldAlert, color: 'text-admin-danger', bgColor: 'bg-admin-danger/10' },
    { label: '异常事件', value: mockAnomalies.filter(a => a.status === 'pending').length, icon: AlertTriangle, color: 'text-admin-warning', bgColor: 'bg-admin-warning/10' },
  ];

  const securityFeatures = [
    { name: '暴力破解防护', status: 'enabled', description: '自动检测并阻止暴力破解尝试', icon: ShieldCheck },
    { name: 'IP黑名单', status: 'enabled', description: '阻止恶意IP地址访问', icon: Ban },
    { name: '异常行为检测', status: 'enabled', description: '实时监控异常用户行为', icon: Activity },
    { name: '登录日志记录', status: 'enabled', description: '记录所有登录行为', icon: History },
    { name: '双重认证', status: 'disabled', description: '增强账户安全', icon: Key },
    { name: '会话超时', status: 'enabled', description: '自动终止空闲会话', icon: Clock },
  ];

  const filteredLogs = mockLoginLogs.filter(log => {
    const matchSearch = !searchQuery || 
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);
    const matchStatus = !filterStatus || log.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredBlocks = mockIPBlocks.filter(block => {
    return !searchQuery || block.ip.includes(searchQuery) || block.reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredAnomalies = mockAnomalies.filter(anomaly => {
    const matchSearch = !searchQuery || anomaly.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || anomaly.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(
    activeTab === 'login_logs' ? filteredLogs.length / itemsPerPage :
    activeTab === 'ip_blocking' ? filteredBlocks.length / itemsPerPage :
    activeTab === 'anomalies' ? filteredAnomalies.length / itemsPerPage : 1
  );

  const paginatedItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    if (activeTab === 'login_logs') return filteredLogs.slice(start, end);
    if (activeTab === 'ip_blocking') return filteredBlocks.slice(start, end);
    if (activeTab === 'anomalies') return filteredAnomalies.slice(start, end);
    return [];
  };

  const handleBlockIP = (ip: string) => {
    addLog({
      action: '封禁IP',
      module: '安全中心',
      target_id: ip,
      target_name: ip,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `封禁IP地址: ${ip}`,
    });
  };

  const handleUnblockIP = (ip: string) => {
    addLog({
      action: '解封IP',
      module: '安全中心',
      target_id: ip,
      target_name: ip,
      user_id: currentUser?.id || '',
      user_name: currentUser?.username || '',
      result: 'success',
      details: `解封IP地址: ${ip}`,
    });
  };

  const riskConfig = {
    low: { label: '低', color: 'bg-admin-success/15 text-admin-success' },
    medium: { label: '中', color: 'bg-admin-warning/15 text-admin-warning' },
    high: { label: '高', color: 'bg-admin-danger/15 text-admin-danger' },
    critical: { label: '严重', color: 'bg-admin-danger text-white' },
  };

  const anomalyTypeConfig = {
    brute_force: { label: '暴力破解', icon: Lock },
    suspicious_activity: { label: '异常行为', icon: AlertCircle },
    data_leak: { label: '数据泄露', icon: FileText },
    privilege_escalation: { label: '权限提升', icon: Fingerprint },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">安全中心</h1>
          <p className="text-admin-text-muted mt-2">监控和管理平台安全，检测并响应威胁</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {securityStats.map((stat, index) => (
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
        {(['overview', 'login_logs', 'ip_blocking', 'anomalies'] as SecurityTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-admin-bg'
                : 'text-admin-text-secondary hover:text-white'
            }`}
          >
            {tab === 'overview' && <Shield className="w-4 h-4" />}
            {tab === 'login_logs' && <History className="w-4 h-4" />}
            {tab === 'ip_blocking' && <IP className="w-4 h-4" />}
            {tab === 'anomalies' && <AlertTriangle className="w-4 h-4" />}
            {tab === 'overview' && '概览'}
            {tab === 'login_logs' && '登录日志'}
            {tab === 'ip_blocking' && 'IP封禁'}
            {tab === 'anomalies' && '异常检测'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="admin-card p-6">
            <h2 className="text-lg font-bold text-white mb-6">安全状态</h2>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke={threatLevel === 'safe' ? '#10B981' : threatLevel === 'warning' ? '#F59E0B' : '#EF4444'} 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${securityScore * 3.52} 352`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${threatLevel === 'safe' ? 'text-admin-success' : threatLevel === 'warning' ? 'text-admin-warning' : 'text-admin-danger'}`}>
                    {securityScore}%
                  </span>
                  <span className="text-xs text-admin-text-muted">安全评分</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${threatLevel === 'safe' ? 'bg-admin-success/10' : threatLevel === 'warning' ? 'bg-admin-warning/10' : 'bg-admin-danger/10'}`}>
                        {threatLevel === 'safe' ? <CheckCircle2 className="w-5 h-5 text-admin-success" /> : <AlertTriangle className={`w-5 h-5 ${threatLevel === 'warning' ? 'text-admin-warning' : 'text-admin-danger'}`} />}
                      </div>
                      <div>
                        <p className="font-medium text-white">系统安全状态</p>
                        <p className="text-sm text-admin-text-muted">
                          {threatLevel === 'safe' ? '系统运行正常，暂无安全威胁' : threatLevel === 'warning' ? '存在中等安全风险，请关注' : '检测到严重安全威胁，请立即处理'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-admin-text-muted" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-admin-success/5 rounded-xl border border-admin-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-admin-success" />
                        <span className="text-sm text-admin-success">已拦截攻击</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockIPBlocks.length}</p>
                    </div>
                    <div className="p-4 bg-admin-warning/5 rounded-xl border border-admin-warning/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-admin-warning" />
                        <span className="text-sm text-admin-warning">待处理异常</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockAnomalies.filter(a => a.status === 'pending').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="text-lg font-bold text-white mb-6">安全功能</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className={`p-4 rounded-xl ${feature.status === 'enabled' ? 'bg-admin-success/5 border border-admin-success/20' : 'bg-admin-danger/5 border border-admin-danger/20'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.status === 'enabled' ? 'bg-admin-success/10' : 'bg-admin-danger/10'}`}>
                      <feature.icon className={`w-5 h-5 ${feature.status === 'enabled' ? 'text-admin-success' : 'text-admin-danger'}`} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${feature.status === 'enabled' ? 'bg-admin-success/15 text-admin-success' : 'bg-admin-danger/15 text-admin-danger'}`}>
                      {feature.status === 'enabled' ? '已启用' : '已禁用'}
                    </span>
                  </div>
                  <h3 className="font-medium text-white mb-1">{feature.name}</h3>
                  <p className="text-sm text-admin-text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="text-lg font-bold text-white mb-6">最近异常事件</h2>
            <div className="space-y-4">
              {mockAnomalies.slice(0, 5).map((anomaly) => {
                const TypeIcon = anomalyTypeConfig[anomaly.type].icon;
                return (
                  <div key={anomaly.id} className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskConfig[anomaly.severity].color}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{anomaly.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${riskConfig[anomaly.severity].color}`}>
                            {riskConfig[anomaly.severity].label}
                          </span>
                          <span className="text-xs text-admin-text-muted">{anomaly.source_ip}</span>
                          <span className="text-xs text-admin-text-muted">{new Date(anomaly.detected_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      anomaly.status === 'resolved' ? 'bg-admin-success/15 text-admin-success' :
                      anomaly.status === 'pending' ? 'bg-admin-warning/15 text-admin-warning' :
                      'bg-admin-text-muted/15 text-admin-text-muted'
                    }`}>
                      {anomaly.status === 'resolved' ? '已解决' : anomaly.status === 'pending' ? '待处理' : '误报'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'login_logs' || activeTab === 'ip_blocking' || activeTab === 'anomalies') && (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-admin-dropdown border border-admin-border flex-1 max-w-md">
              <Search className="w-5 h-5 text-admin-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={activeTab === 'login_logs' ? '搜索用户名或IP...' : activeTab === 'ip_blocking' ? '搜索IP或原因...' : '搜索描述...'}
                className="bg-transparent border-none outline-none text-white placeholder-admin-text-muted w-full"
              />
            </div>
            {(activeTab === 'login_logs' || activeTab === 'anomalies') && (
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="appearance-none bg-admin-dropdown border border-admin-border rounded-xl px-4 py-2.5 outline-none text-white text-sm pr-10"
                >
                  <option value="">全部状态</option>
                  {activeTab === 'login_logs' && (
                    <>
                      <option value="success">登录成功</option>
                      <option value="failed">登录失败</option>
                    </>
                  )}
                  {activeTab === 'anomalies' && (
                    <>
                      <option value="pending">待处理</option>
                      <option value="resolved">已解决</option>
                      <option value="false_positive">误报</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
              </div>
            )}
          </div>

          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-admin-border">
                    {activeTab === 'login_logs' && (
                      <>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">用户</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">IP地址</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">位置</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">设备</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">状态</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">风险等级</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">时间</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作</th>
                      </>
                    )}
                    {activeTab === 'ip_blocking' && (
                      <>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">IP地址</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">封禁原因</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">封禁时间</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">过期时间</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作</th>
                      </>
                    )}
                    {activeTab === 'anomalies' && (
                      <>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">类型</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">描述</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">来源IP</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">严重程度</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">状态</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">时间</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-admin-text-secondary">操作</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems().map((item) => (
                    <tr key={(item as LoginLog).id || (item as IPBlock).id || (item as Anomaly).id} className="border-b border-admin-border/50 hover:bg-admin-hover/50 transition-colors">
                      {activeTab === 'login_logs' && (
                        <>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-admin-icon-bg flex items-center justify-center text-sm font-medium text-admin-primary">
                                {(item as LoginLog).username[0].toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{(item as LoginLog).username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-admin-text-secondary">{(item as LoginLog).ip}</td>
                          <td className="py-4 px-6 text-admin-text-secondary">{(item as LoginLog).location}</td>
                          <td className="py-4 px-6 text-admin-text-secondary">{(item as LoginLog).device}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              (item as LoginLog).status === 'success' ? 'bg-admin-success/15 text-admin-success' : 'bg-admin-danger/15 text-admin-danger'
                            }`}>
                              {(item as LoginLog).status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle2 className="w-3 h-3" />}
                              {(item as LoginLog).status === 'success' ? '成功' : '失败'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskConfig[(item as LoginLog).risk_level].color}`}>
                              {riskConfig[(item as LoginLog).risk_level].label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-admin-text-secondary">
                            {new Date((item as LoginLog).timestamp).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <button 
                              onClick={() => handleBlockIP((item as LoginLog).ip)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-admin-danger hover:bg-admin-danger/10 transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                              封禁IP
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === 'ip_blocking' && (
                        <>
                          <td className="py-4 px-6 text-white font-mono">{(item as IPBlock).ip}</td>
                          <td className="py-4 px-6 text-admin-text-secondary">{(item as IPBlock).reason}</td>
                          <td className="py-4 px-6 text-admin-text-secondary">
                            {new Date((item as IPBlock).blocked_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-admin-text-secondary">
                            {new Date((item as IPBlock).expires_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <button 
                              onClick={() => handleUnblockIP((item as IPBlock).ip)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-admin-success hover:bg-admin-success/10 transition-colors"
                            >
                              <Unban className="w-4 h-4" />
                              解封
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === 'anomalies' && (
                        <>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-admin-primary/15 text-admin-primary`}>
                              {anomalyTypeConfig[(item as Anomaly).type].label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-admin-text-secondary">{(item as Anomaly).description}</td>
                          <td className="py-4 px-6 text-admin-text-secondary font-mono">{(item as Anomaly).source_ip}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskConfig[(item as Anomaly).severity].color}`}>
                              {riskConfig[(item as Anomaly).severity].label}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              (item as Anomaly).status === 'resolved' ? 'bg-admin-success/15 text-admin-success' :
                              (item as Anomaly).status === 'pending' ? 'bg-admin-warning/15 text-admin-warning' :
                              'bg-admin-text-muted/15 text-admin-text-muted'
                            }`}>
                              {(item as Anomaly).status === 'resolved' ? '已解决' : (item as Anomaly).status === 'pending' ? '待处理' : '误报'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-admin-text-secondary">
                            {new Date((item as Anomaly).detected_at).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {((item as Anomaly).status === 'pending') && (
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-admin-success hover:bg-admin-success/10 transition-colors">
                                <CheckCircle2 className="w-4 h-4" />
                                标记已解决
                              </button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
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
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}