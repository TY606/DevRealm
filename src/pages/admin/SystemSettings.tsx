import { useState } from 'react';
import { 
  Settings, Globe, Bell, Shield, Database, Palette,
  Save, RefreshCw, Download, Upload, Trash2,
  Check, X, ChevronRight, ChevronDown, Info,
  Mail, Phone, MapPin, Clock, Zap, AlertCircle,
  Moon, Sun, Volume2, VolumeX, Lock, Unlock,
  User, FileText, Code, Wifi, WifiOff, Cloud,
  CloudOff, Activity, Server, HardDrive, Cpu
} from 'lucide-react';
import { useAuditStore } from '@/store/auditStore';
import { useAuthStore } from '@/store/authStore';

type SettingsTab = 'site' | 'appearance' | 'notifications' | 'security' | 'backup' | 'system';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface AppearanceSettings {
  theme: 'dark' | 'light' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  showAnimations: boolean;
  showBackgroundEffects: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  activityNotifications: boolean;
  moderationNotifications: boolean;
  securityNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  notificationSound: boolean;
}

interface SecuritySettings {
  requireEmailVerification: boolean;
  enableTwoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  enableBruteForceProtection: boolean;
  enableIPBlocking: boolean;
  enableAnomalyDetection: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventCommonPasswords: boolean;
  };
}

export default function SystemSettings() {
  const { addLog } = useAuditStore();
  const { user: currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('site');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | ''>('');

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'DevRealm',
    siteDescription: '开发者社区 - 分享技术，交流经验',
    siteLogo: '',
    siteFavicon: '',
    siteUrl: 'https://devrealm.example.com',
    contactEmail: 'contact@devrealm.com',
    contactPhone: '+86 123 4567 8900',
    contactAddress: '北京市海淀区中关村科技园',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    maintenanceMode: false,
    maintenanceMessage: '网站正在维护中，请稍后再试。',
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'dark',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    accentColor: '#10B981',
    fontSize: 'medium',
    showAnimations: true,
    showBackgroundEffects: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    activityNotifications: true,
    moderationNotifications: true,
    securityNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,
    notificationSound: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireEmailVerification: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableBruteForceProtection: true,
    enableIPBlocking: true,
    enableAnomalyDetection: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      preventCommonPasswords: true,
    },
  });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      addLog({
        action: '保存设置',
        module: '系统设置',
        target_id: activeTab,
        target_name: activeTab,
        user_id: currentUser?.id || '',
        user_name: currentUser?.username || '',
        result: 'success',
        details: `保存了${activeTab}设置`,
      });
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const mockSystemInfo = {
    version: '1.0.0',
    build: '2024.06.20',
    uptime: '99.9%',
    nodeVersion: 'v18.17.0',
    memoryUsage: '45%',
    cpuUsage: '23%',
    storageUsage: '68%',
    database: 'Connected',
    redis: 'Connected',
    cache: 'Active',
  };

  const mockBackups = [
    { id: '1', name: '自动备份 - 2024-06-20', size: '256 MB', date: '2024-06-20 02:00:00', status: 'completed', type: 'auto' },
    { id: '2', name: '手动备份 - 2024-06-19', size: '248 MB', date: '2024-06-19 15:30:00', status: 'completed', type: 'manual' },
    { id: '3', name: '自动备份 - 2024-06-19', size: '245 MB', date: '2024-06-19 02:00:00', status: 'completed', type: 'auto' },
    { id: '4', name: '自动备份 - 2024-06-18', size: '238 MB', date: '2024-06-18 02:00:00', status: 'completed', type: 'auto' },
    { id: '5', name: '手动备份 - 2024-06-17', size: '235 MB', date: '2024-06-17 10:00:00', status: 'completed', type: 'manual' },
  ];

  const renderToggle = (value: boolean, onChange: (value: boolean) => void) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        value ? 'bg-admin-primary' : 'bg-admin-text-muted/30'
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          value ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">系统设置</h1>
          <p className="text-admin-text-muted mt-2">管理网站配置、外观、通知和安全设置</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-admin-primary to-admin-secondary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saveStatus === 'saving' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              保存中...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-5 h-5" />
              已保存
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              保存更改
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="admin-card p-4 sticky top-6">
            <nav className="space-y-1">
              {(['site', 'appearance', 'notifications', 'security', 'backup', 'system'] as SettingsTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab
                      ? 'bg-admin-primary/15 text-admin-primary'
                      : 'text-admin-text-secondary hover:text-white hover:bg-admin-hover'
                  }`}
                >
                  {tab === 'site' && <Globe className="w-5 h-5" />}
                  {tab === 'appearance' && <Palette className="w-5 h-5" />}
                  {tab === 'notifications' && <Bell className="w-5 h-5" />}
                  {tab === 'security' && <Shield className="w-5 h-5" />}
                  {tab === 'backup' && <Database className="w-5 h-5" />}
                  {tab === 'system' && <Settings className="w-5 h-5" />}
                  <span className="font-medium">{tab === 'site' && '站点设置'}{tab === 'appearance' && '外观设置'}{tab === 'notifications' && '通知设置'}{tab === 'security' && '安全设置'}{tab === 'backup' && '备份管理'}{tab === 'system' && '系统信息'}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'site' && (
            <div className="admin-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-4">基本信息</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">站点名称</label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">站点URL</label>
                    <input
                      type="text"
                      value={siteSettings.siteUrl}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">站点描述</label>
                    <textarea
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">联系方式</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">
                      <Mail className="w-4 h-4 inline mr-1" />
                      联系邮箱
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">
                      <Phone className="w-4 h-4 inline mr-1" />
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={siteSettings.contactPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      联系地址
                    </label>
                    <input
                      type="text"
                      value={siteSettings.contactAddress}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">区域设置</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">
                      <Clock className="w-4 h-4 inline mr-1" />
                      时区
                    </label>
                    <select
                      value={siteSettings.timezone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors appearance-none"
                    >
                      <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      <option value="America/New_York">America/New_York (UTC-4)</option>
                      <option value="Europe/London">Europe/London (UTC+1)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">语言</label>
                    <select
                      value={siteSettings.language}
                      onChange={(e) => setSiteSettings({ ...siteSettings, language: e.target.value })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors appearance-none"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                      <option value="ja-JP">日本語</option>
                      <option value="ko-KR">한국어</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">维护模式</h2>
                <div className="flex items-center justify-between p-4 bg-admin-warning/5 rounded-xl">
                  <div>
                    <p className="font-medium text-white">启用维护模式</p>
                    <p className="text-sm text-admin-text-muted mt-1">启用后，所有非管理员用户将无法访问网站</p>
                  </div>
                  {renderToggle(siteSettings.maintenanceMode, (value) => setSiteSettings({ ...siteSettings, maintenanceMode: value }))}
                </div>
                {siteSettings.maintenanceMode && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">维护提示消息</label>
                    <textarea
                      value={siteSettings.maintenanceMessage}
                      onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMessage: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-warning/30 rounded-xl text-white outline-none focus:border-admin-warning transition-colors resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="admin-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-4">主题设置</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['dark', 'light', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, theme })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        appearanceSettings.theme === theme
                          ? 'border-admin-primary bg-admin-primary/10'
                          : 'border-admin-border hover:border-admin-border/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-900' : theme === 'light' ? 'bg-white' : 'bg-gradient-to-r from-gray-900 to-white'
                      }`}>
                        {theme === 'dark' && <Moon className="w-6 h-6 text-white" />}
                        {theme === 'light' && <Sun className="w-6 h-6 text-gray-900" />}
                        {theme === 'auto' && <Zap className="w-6 h-6 text-admin-primary" />}
                      </div>
                      <p className="text-center font-medium text-white">
                        {theme === 'dark' && '深色模式'}{theme === 'light' && '浅色模式'}{theme === 'auto' && '自动切换'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">颜色配置</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">主色调</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">次色调</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">强调色</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearanceSettings.accentColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, accentColor: e.target.value })}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceSettings.accentColor}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, accentColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">显示设置</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">字体大小</label>
                    <div className="flex gap-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setAppearanceSettings({ ...appearanceSettings, fontSize: size })}
                          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                            appearanceSettings.fontSize === size
                              ? 'bg-admin-primary text-white'
                              : 'bg-admin-dropdown text-admin-text-secondary hover:text-white'
                          }`}
                        >
                          {size === 'small' && '小'}{size === 'medium' && '中'}{size === 'large' && '大'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div>
                      <p className="font-medium text-white">启用动画效果</p>
                      <p className="text-sm text-admin-text-muted mt-1">页面切换和交互时显示动画效果</p>
                    </div>
                    {renderToggle(appearanceSettings.showAnimations, (value) => setAppearanceSettings({ ...appearanceSettings, showAnimations: value }))}
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div>
                      <p className="font-medium text-white">启用背景特效</p>
                      <p className="text-sm text-admin-text-muted mt-1">页面背景显示动态效果</p>
                    </div>
                    {renderToggle(appearanceSettings.showBackgroundEffects, (value) => setAppearanceSettings({ ...appearanceSettings, showBackgroundEffects: value }))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="admin-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">通知偏好</h2>
              {[
                { key: 'emailNotifications', label: '邮件通知', description: '接收重要事件的邮件通知', icon: Mail },
                { key: 'pushNotifications', label: '推送通知', description: '接收浏览器推送通知', icon: Bell },
                { key: 'notificationSound', label: '通知声音', description: '收到通知时播放提示音', icon: Volume2 },
                { key: 'activityNotifications', label: '活动通知', description: '接收关注用户的动态更新', icon: Activity },
                { key: 'moderationNotifications', label: '审核通知', description: '接收内容审核相关通知', icon: FileText },
                { key: 'securityNotifications', label: '安全通知', description: '接收安全相关的告警通知', icon: Shield },
                { key: 'weeklyDigest', label: '周报摘要', description: '每周收到平台活动摘要', icon: Clock },
                { key: 'marketingEmails', label: '营销邮件', description: '接收产品更新和促销信息', icon: Mail },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-admin-icon-bg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-admin-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-admin-text-muted">{item.description}</p>
                    </div>
                  </div>
                  {renderToggle(notificationSettings[item.key as keyof NotificationSettings], (value) => setNotificationSettings({ ...notificationSettings, [item.key]: value }))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="admin-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-4">账户安全</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div>
                      <p className="font-medium text-white">邮箱验证</p>
                      <p className="text-sm text-admin-text-muted mt-1">新用户注册后必须验证邮箱</p>
                    </div>
                    {renderToggle(securitySettings.requireEmailVerification, (value) => setSecuritySettings({ ...securitySettings, requireEmailVerification: value }))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div>
                      <p className="font-medium text-white">双重认证</p>
                      <p className="text-sm text-admin-text-muted mt-1">登录时需要额外验证</p>
                    </div>
                    {renderToggle(securitySettings.enableTwoFactorAuth, (value) => setSecuritySettings({ ...securitySettings, enableTwoFactorAuth: value }))}
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">会话设置</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">
                      <Clock className="w-4 h-4 inline mr-1" />
                      会话超时 (分钟)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">最大登录尝试次数</label>
                    <input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-admin-text-secondary">锁定时长 (分钟)</label>
                    <input
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, lockoutDuration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-admin-dropdown border border-admin-border rounded-xl text-white outline-none focus:border-admin-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">安全防护</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'enableBruteForceProtection', label: '暴力破解防护', description: '自动检测并阻止暴力破解', icon: Shield },
                    { key: 'enableIPBlocking', label: 'IP封禁', description: '自动封禁恶意IP地址', icon: Lock },
                    { key: 'enableAnomalyDetection', label: '异常检测', description: '实时监控异常行为', icon: AlertCircle },
                  ].map((item) => (
                    <div key={item.key} className="p-4 bg-admin-dropdown rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-admin-icon-bg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-admin-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-xs text-admin-text-muted">{item.description}</p>
                        </div>
                        {renderToggle(securitySettings[item.key as keyof SecuritySettings], (value) => setSecuritySettings({ ...securitySettings, [item.key]: value }))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-admin-border pt-6">
                <h2 className="text-lg font-bold text-white mb-4">密码策略</h2>
                <div className="bg-admin-dropdown rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-admin-text-secondary">最小长度</label>
                    <input
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordPolicy: { ...securitySettings.passwordPolicy, minLength: parseInt(e.target.value) || 0 } })}
                      className="w-20 px-3 py-2 bg-admin-bg border border-admin-border rounded-lg text-white outline-none focus:border-admin-primary"
                    />
                  </div>
                  {[
                    { key: 'requireUppercase', label: '要求大写字母' },
                    { key: 'requireLowercase', label: '要求小写字母' },
                    { key: 'requireNumbers', label: '要求数字' },
                    { key: 'requireSpecialChars', label: '要求特殊字符' },
                    { key: 'preventCommonPasswords', label: '禁止常见密码' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-admin-border/50 last:border-0">
                      <span className="text-white">{item.label}</span>
                      {renderToggle(securitySettings.passwordPolicy[item.key as keyof typeof securitySettings.passwordPolicy], (value) => setSecuritySettings({ ...securitySettings, passwordPolicy: { ...securitySettings.passwordPolicy, [item.key]: value } }))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="admin-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">备份管理</h2>
                  <p className="text-sm text-admin-text-muted mt-1">定期备份确保数据安全</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-admin-primary text-white font-medium hover:bg-admin-primary/90 transition-colors">
                  <Download className="w-5 h-5" />
                  创建备份
                </button>
              </div>

              <div className="space-y-3">
                {mockBackups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 bg-admin-dropdown rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${backup.type === 'auto' ? 'bg-admin-primary/10' : 'bg-admin-success/10'}`}>
                        {backup.type === 'auto' ? <Clock className="w-5 h-5 text-admin-primary" /> : <Database className="w-5 h-5 text-admin-success" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{backup.name}</p>
                        <p className="text-sm text-admin-text-muted">{backup.date} · {backup.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${backup.status === 'completed' ? 'bg-admin-success/15 text-admin-success' : 'bg-admin-warning/15 text-admin-warning'}`}>
                        {backup.status === 'completed' ? '已完成' : '进行中'}
                      </span>
                      <button className="p-2 rounded-lg text-admin-text-muted hover:text-admin-primary hover:bg-admin-primary/10 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger/10 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="admin-card p-6">
                <h2 className="text-lg font-bold text-white mb-6">系统信息</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '版本', value: mockSystemInfo.version, icon: Code, color: 'text-admin-primary', bgColor: 'bg-admin-primary/10' },
                    { label: '构建日期', value: mockSystemInfo.build, icon: Clock, color: 'text-admin-secondary', bgColor: 'bg-admin-secondary/10' },
                    { label: '运行时间', value: mockSystemInfo.uptime, icon: Activity, color: 'text-admin-success', bgColor: 'bg-admin-success/10' },
                    { label: 'Node.js', value: mockSystemInfo.nodeVersion, icon: Server, color: 'text-admin-warning', bgColor: 'bg-admin-warning/10' },
                  ].map((stat, index) => (
                    <div key={index} className="p-4 bg-admin-dropdown rounded-xl">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor} mb-3`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-sm text-admin-text-muted mb-1">{stat.label}</p>
                      <p className="font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card p-6">
                <h2 className="text-lg font-bold text-white mb-6">资源使用</h2>
                <div className="space-y-4">
                  {[
                    { label: '内存使用', value: mockSystemInfo.memoryUsage, icon: HardDrive },
                    { label: 'CPU使用', value: mockSystemInfo.cpuUsage, icon: Cpu },
                    { label: '存储使用', value: mockSystemInfo.storageUsage, icon: Database },
                  ].map((item, index) => {
                    const percentage = parseInt(item.value);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-admin-text-muted" />
                            <span className="text-admin-text-secondary">{item.label}</span>
                          </div>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                        <div className="h-2 bg-admin-dropdown rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              percentage > 80 ? 'bg-admin-danger' : percentage > 60 ? 'bg-admin-warning' : 'bg-admin-success'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-card p-6">
                <h2 className="text-lg font-bold text-white mb-6">服务状态</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: '数据库', status: mockSystemInfo.database === 'Connected' ? 'online' : 'offline', icon: Database },
                    { name: 'Redis缓存', status: mockSystemInfo.redis === 'Connected' ? 'online' : 'offline', icon: Zap },
                    { name: 'CDN服务', status: mockSystemInfo.cache === 'Active' ? 'online' : 'offline', icon: Cloud },
                  ].map((service, index) => (
                    <div key={index} className={`p-4 rounded-xl ${service.status === 'online' ? 'bg-admin-success/5 border border-admin-success/20' : 'bg-admin-danger/5 border border-admin-danger/20'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.status === 'online' ? 'bg-admin-success/10' : 'bg-admin-danger/10'}`}>
                          {service.status === 'online' ? (
                            <service.icon className="w-5 h-5 text-admin-success" />
                          ) : (
                            <service.icon className="w-5 h-5 text-admin-danger" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{service.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${service.status === 'online' ? 'bg-admin-success/15 text-admin-success' : 'bg-admin-danger/15 text-admin-danger'}`}>
                            {service.status === 'online' ? '运行中' : '离线'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}