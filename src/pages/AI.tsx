import { useState } from 'react';
import { MessageSquare, Code, Users, Sparkles, Send, Copy, Check, Terminal, FileCode, Lightbulb, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import { mockExperts } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';

type TabType = 'chat' | 'code' | 'expert';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AI() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 DevRealm AI 助手，很高兴为你提供游戏开发方面的帮助。\n\n我可以帮你：\n- 设计游戏架构和技术方案\n- 编写代码和调试问题\n- 提供性能优化建议\n- 解答引擎相关问题\n\n请问有什么我可以帮你的吗？',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [codeInput, setCodeInput] = useState('// 在此输入代码，AI 将帮助你分析和优化\n\nfunction gameLoop() {\n  // 游戏主循环逻辑\n}');
  const [codeOutput, setCodeOutput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '感谢你的提问！根据你的需求，我建议：\n\n1. 首先进行需求分析和原型设计\n2. 选择合适的游戏引擎（Unity/Unreal/Godot）\n3. 设计合理的架构模式\n4. 逐步实现核心功能\n\n如果你有具体的问题或代码片段，我可以提供更详细的解答和建议。',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAnalyzeCode = () => {
    if (!codeInput.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setCodeOutput(`代码分析结果：

1. 代码质量评估：良好
   - 代码结构清晰，命名规范
   - 建议添加更多注释说明

2. 性能优化建议：
   - 使用对象池减少内存分配
   - 考虑使用 Job System 并行处理
   - 添加帧率限制避免性能浪费

3. 安全检查：
   - 未发现明显安全隐患
   - 建议添加输入验证

4. 重构建议：
   - 考虑将游戏循环拆分为多个子系统
   - 使用状态模式管理游戏状态`);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickQuestions = [
    { question: '如何设计一款2D平台游戏？', icon: 'Gamepad2' },
    { question: 'Unity性能优化最佳实践', icon: 'TrendingUp' },
    { question: '如何实现多人联机功能？', icon: 'Users' },
    { question: '独立游戏发行策略', icon: 'Briefcase' },
  ];

  const chatTab = (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-secondary'
                  : 'bg-dark-600'
              }`}
            >
              {message.role === 'user' ? (
                <span className="text-white font-bold text-sm">你</span>
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
            </div>
            <div
              className={`max-w-[70%] ${
                message.role === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`inline-block px-5 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-md'
                    : 'bg-dark-700/80 text-gray-300 rounded-bl-md'
                }`}
              >
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-1 last:mb-0 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {message.timestamp.toLocaleTimeString('zh-CN')}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-dark-600">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="bg-dark-700/80 px-5 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-dark-800/50">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((item, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(item.question)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-dark-700/50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-all border border-white/5"
            >
              <Lightbulb className="w-3 h-3" />
              {item.question}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入你的问题..."
            className="flex-1 px-5 py-3 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const codeTab = (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 p-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-700/80 rounded-t-xl border-b border-white/5">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">代码输入</span>
            </div>
            <button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? '分析中...' : '分析代码'}
            </button>
          </div>
          <textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="flex-1 p-4 bg-dark-800 font-mono text-sm text-gray-300 resize-none outline-none rounded-b-xl"
            placeholder="在此输入代码..."
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-700/80 rounded-t-xl border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-white">分析结果</span>
            </div>
            {codeOutput && (
              <button
                onClick={() => handleCopy(codeOutput)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-600 text-gray-400 text-sm hover:bg-dark-500 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 p-4 bg-dark-800 font-mono text-sm text-gray-300 overflow-auto rounded-b-xl">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Sparkles className="w-10 h-10 mb-3 animate-pulse text-primary" />
                <p>AI 正在分析你的代码...</p>
              </div>
            ) : codeOutput ? (
              <pre className="whitespace-pre-wrap">{codeOutput}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Terminal className="w-12 h-12 mb-3 opacity-30" />
                <p>输入代码并点击分析按钮</p>
                <p className="text-xs mt-2">AI 将为你提供代码审查和优化建议</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-dark-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
            <Code className="w-4 h-4" />
            生成代码
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
            <Lightbulb className="w-4 h-4" />
            优化建议
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
            <Shield className="w-4 h-4" />
            安全检查
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5">
            <FileCode className="w-4 h-4" />
            文档生成
          </button>
        </div>
      </div>
    </div>
  );

  const expertTab = (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold text-white mb-2">VIP 专家团队</h3>
        <p className="text-gray-400">专业游戏开发专家一对一指导</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockExperts.map((expert, index) => (
          <div
            key={expert.id}
            className="glass-card p-5 hover-lift group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={expert.avatar_url}
                alt={expert.name}
                className="w-14 h-14 rounded-full flex-shrink-0 border-2 border-primary/30"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{expert.name}</h4>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent">
                    <Star className="w-3 h-3 fill-current" />
                    VIP
                  </span>
                </div>
                <p className="text-sm text-primary">{expert.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < expert.rating ? 'text-accent fill-accent' : 'text-gray-600'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{expert.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{expert.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {expert.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-full text-xs bg-dark-700/50 text-gray-400 border border-white/5">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {expert.response_time}
                </span>
                <span>{expert.sessions} 次咨询</span>
              </div>
              {isAuthenticated ? (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-all">
                  预约咨询
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button className="px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium border border-white/5">
                  登录后预约
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2">成为 VIP 专家</h3>
            <p className="text-gray-400">分享你的专业知识，获得丰厚回报</p>
          </div>
          {isAuthenticated ? (
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-secondary text-white font-medium hover:opacity-90 transition-all">
              <Users className="w-5 h-5" />
              申请成为专家
            </button>
          ) : (
            <button className="px-6 py-3 rounded-xl bg-dark-700/50 text-gray-400 font-medium border border-white/5">
              登录后申请
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">AI 辅助开发</h1>
            <p className="text-gray-400">智能代码分析、架构设计与专家指导</p>
          </div>
          {isAuthenticated && user?.role === 'vip' && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent border border-accent/30">
              <Star className="w-4 h-4 fill-current" />
              VIP 会员专享
            </span>
          )}
        </div>

        <div className="glass-card h-[600px] flex flex-col">
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'chat'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              AI 对话
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'code'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-5 h-5" />
              代码分析
            </button>
            <button
              onClick={() => setActiveTab('expert')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === 'expert'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5" />
              专家咨询
            </button>
          </div>

          {activeTab === 'chat' && chatTab}
          {activeTab === 'code' && codeTab}
          {activeTab === 'expert' && expertTab}
        </div>
      </div>
    </div>
  );
}