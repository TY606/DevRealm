import { useState } from 'react';
import { Gamepad2, Upload, Check, Clock, TrendingUp, Users, DollarSign, ChevronRight, FileText, Package, Globe, ArrowRight, Plus, X, Star } from 'lucide-react';
import { mockGames, mockChannels, mockContracts } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';

type TabType = 'dashboard' | 'publish' | 'contracts';

export default function Publish() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showChannelModal, setShowChannelModal] = useState(false);

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const stats = [
    { label: '已发布游戏', value: '12', icon: Gamepad2, color: 'text-primary' },
    { label: '总下载量', value: '245K', icon: Download, color: 'text-secondary' },
    { label: '活跃用户', value: '18K', icon: Users, color: 'text-accent' },
    { label: '总收入', value: '$45K', icon: DollarSign, color: 'text-green-400' },
  ];

  const recentGames = mockGames.slice(0, 5);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">游戏发布</h1>
            <p className="text-gray-400">一站式多渠道发行与合同管理</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('publish')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              发布新游戏
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-5 h-5" />
            发行控制台
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'publish'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-5 h-5" />
            发布游戏
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-dark-700/50 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            合同管理
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-5 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-dark-700/50 mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">近期发布</h3>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  查看全部 <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>

              <div className="space-y-4">
                {recentGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={game.cover_image || game.cover_url}
                      alt={game.title || game.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white">{game.title || game.name}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            game.status === 'published' || game.status === 'live' || game.status === 'approved'
                              ? 'bg-green-500/15 text-green-400'
                              : game.status === 'pending'
                              ? 'bg-yellow-500/15 text-yellow-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {game.status === 'published' || game.status === 'live' || game.status === 'approved' ? '已发布' : game.status === 'pending' ? '审核中' : '已下架'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {game.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {game.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {game.updated_at}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
                      管理
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-display text-xl font-bold text-white mb-4">发行渠道概览</h3>
                <div className="space-y-3">
                  {mockChannels.slice(0, 4).map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: channel.color + '15' }}
                        >
                          <Globe className="w-5 h-5" style={{ color: channel.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{channel.name}</p>
                          <p className="text-xs text-gray-500">{channel.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">+23%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-xl font-bold text-white mb-4">收入趋势</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {['1月', '2月', '3月', '4月', '5月', '6月'].map((month, index) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary" style={{ height: `${Math.random() * 80 + 20}%` }} />
                      <span className="text-xs text-gray-500">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">发布新游戏</h2>
                <p className="text-gray-400">填写游戏信息并选择发行渠道</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm">
                <Check className="w-4 h-4" />
                一键多渠道发布
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">游戏名称</label>
                  <input
                    type="text"
                    placeholder="输入游戏名称"
                    className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">游戏类型</label>
                  <select className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white">
                    <option value="">选择游戏类型</option>
                    <option value="action">动作游戏</option>
                    <option value="rpg">角色扮演</option>
                    <option value="strategy">策略游戏</option>
                    <option value="puzzle">益智游戏</option>
                    <option value="simulation">模拟经营</option>
                    <option value="adventure">冒险游戏</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">游戏封面</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/30 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 mb-2">点击或拖拽上传封面图片</p>
                  <p className="text-xs text-gray-600">支持 JPG、PNG 格式，建议尺寸 1200x630</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">游戏简介</label>
                <textarea
                  placeholder="介绍你的游戏特色和玩法..."
                  rows={4}
                  className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary resize-none text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">发行渠道</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {selectedChannels.map((channelId) => {
                    const channel = mockChannels.find((c) => c.id === channelId);
                    if (!channel) return null;
                    return (
                      <span
                        key={channelId}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary border border-primary/30"
                      >
                        <Globe className="w-4 h-4" />
                        {channel.name}
                        <button
                          onClick={() => toggleChannel(channelId)}
                          className="hover:text-primary/70 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    );
                  })}
                  {selectedChannels.length === 0 && (
                    <span className="text-sm text-gray-500">请选择发行渠道</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowChannelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5"
                >
                  <Plus className="w-4 h-4" />
                  添加发行渠道
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">游戏版本</label>
                  <input
                    type="text"
                    placeholder="1.0.0"
                    className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">开发引擎</label>
                  <select className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white">
                    <option value="">选择引擎</option>
                    <option value="unity">Unity</option>
                    <option value="unreal">Unreal Engine</option>
                    <option value="godot">Godot</option>
                    <option value="cocos">Cocos</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">目标平台</label>
                  <select className="w-full p-4 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white">
                    <option value="">选择平台</option>
                    <option value="pc">PC</option>
                    <option value="mobile">移动端</option>
                    <option value="console">主机</option>
                    <option value="all">全平台</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                >
                  保存草稿
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  提交审核
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">待签署</span>
                  <FileText className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-white">3</p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">已签署</span>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">已过期</span>
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">2</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6">合同列表</h3>

              <div className="space-y-4">
                {mockContracts.map((contract, index) => (
                  <div
                    key={contract.id}
                    className="flex items-center gap-4 p-4 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        contract.status === 'pending'
                          ? 'bg-yellow-500/15'
                          : contract.status === 'signed'
                          ? 'bg-green-500/15'
                          : 'bg-red-500/15'
                      }`}
                    >
                      {contract.status === 'pending' && (
                        <FileText className="w-6 h-6 text-yellow-400" />
                      )}
                      {contract.status === 'signed' && (
                        <Check className="w-6 h-6 text-green-400" />
                      )}
                      {contract.status === 'expired' && (
                        <Clock className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white">{contract.title}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'pending'
                              ? 'bg-yellow-500/15 text-yellow-400'
                              : contract.status === 'signed'
                              ? 'bg-green-500/15 text-green-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {contract.status === 'pending' ? '待签署' : contract.status === 'signed' ? '已签署' : '已过期'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{contract.channel_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {contract.valid_until}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {contract.revenue_share}% 分成
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
                        查看详情
                      </button>
                      {contract.status === 'pending' && (
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-all">
                          签署合同
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showChannelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-2xl glass-card rounded-2xl p-8 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-white">选择发行渠道</h2>
                <button
                  onClick={() => setShowChannelModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {mockChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => toggleChannel(channel.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedChannels.includes(channel.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-white/5 hover:border-primary/30 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: channel.color + '15' }}
                    >
                      <Globe className="w-6 h-6" style={{ color: channel.color }} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white">{channel.name}</p>
                      <p className="text-xs text-gray-500">{channel.description}</p>
                    </div>
                    {selectedChannels.includes(channel.id) && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                <button
                  onClick={() => setShowChannelModal(false)}
                  className="flex-1 py-3 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowChannelModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all"
                >
                  确认选择 ({selectedChannels.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Download({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}