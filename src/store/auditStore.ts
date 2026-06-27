import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  target_id?: string;
  target_name?: string;
  user_id: string;
  user_name: string;
  ip_address?: string;
  timestamp: string;
  result: 'success' | 'failed';
  details?: string;
}

interface AuditState {
  logs: AuditLog[];
  initLogs: () => void;
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogs: () => AuditLog[];
  filterLogs: (filters: { module?: string; action?: string; dateRange?: [string, string] }) => AuditLog[];
  searchLogs: (query: string) => AuditLog[];
  clearLogs: () => void;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  logs: [],
  loading: false,

  initLogs: () => {
    const storedLogs = localStorage.getItem('devrealm_audit_logs');
    if (storedLogs) {
      set({ logs: JSON.parse(storedLogs) });
    } else {
      const defaultLogs: AuditLog[] = [
        {
          id: uuidv4(),
          action: '登录',
          module: '安全',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          result: 'success',
          details: '管理员登录成功',
        },
        {
          id: uuidv4(),
          action: '创建',
          module: '用户管理',
          target_id: 'user1',
          target_name: '新用户',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          result: 'success',
          details: '创建用户: newuser@example.com',
        },
        {
          id: uuidv4(),
          action: '审核通过',
          module: '内容审核',
          target_id: 'post1',
          target_name: 'Unity开发指南',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          result: 'success',
          details: '审核通过文章',
        },
        {
          id: uuidv4(),
          action: '登录失败',
          module: '安全',
          user_id: 'unknown',
          user_name: '未知用户',
          ip_address: '10.0.0.50',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          result: 'failed',
          details: '密码错误',
        },
        {
          id: uuidv4(),
          action: '更新',
          module: '游戏管理',
          target_id: 'game1',
          target_name: '太空冒险',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          result: 'success',
          details: '更新游戏状态为已发布',
        },
        {
          id: uuidv4(),
          action: '删除',
          module: '用户管理',
          target_id: 'user2',
          target_name: '违规用户',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          result: 'success',
          details: '删除违规用户',
        },
        {
          id: uuidv4(),
          action: '封禁',
          module: '用户管理',
          target_id: 'user3',
          target_name: 'spammer',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 25200000).toISOString(),
          result: 'success',
          details: '封禁垃圾邮件发送者',
        },
        {
          id: uuidv4(),
          action: '配置修改',
          module: '系统设置',
          user_id: 'admin',
          user_name: 'admin',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
          result: 'success',
          details: '更新站点配置',
        },
      ];
      localStorage.setItem('devrealm_audit_logs', JSON.stringify(defaultLogs));
      set({ logs: defaultLogs });
    }
  },

  addLog: (log) => {
    const newLog: AuditLog = {
      ...log,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    const logs = [newLog, ...get().logs].slice(0, 1000);
    localStorage.setItem('devrealm_audit_logs', JSON.stringify(logs));
    set({ logs });
  },

  getLogs: () => {
    return get().logs;
  },

  filterLogs: (filters) => {
    let logs = get().logs;
    if (filters.module) {
      logs = logs.filter((l) => l.module === filters.module);
    }
    if (filters.action) {
      logs = logs.filter((l) => l.action === filters.action);
    }
    if (filters.dateRange) {
      logs = logs.filter(
        (l) =>
          l.timestamp >= filters.dateRange[0] &&
          l.timestamp <= filters.dateRange[1]
      );
    }
    return logs;
  },

  searchLogs: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().logs.filter(
      (l) =>
        l.user_name.toLowerCase().includes(lowerQuery) ||
        l.target_name?.toLowerCase().includes(lowerQuery) ||
        l.details?.toLowerCase().includes(lowerQuery) ||
        l.ip_address?.toLowerCase().includes(lowerQuery)
    );
  },

  clearLogs: () => {
    localStorage.setItem('devrealm_audit_logs', JSON.stringify([]));
    set({ logs: [] });
  },
}));