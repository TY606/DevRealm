import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Gamepad2, Github, Twitter } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || '登录失败');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(107, 33, 168, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-secondary mb-6 shadow-2xl shadow-primary/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">DevRealm</h1>
          <p className="text-gray-400">游戏开发者的综合平台</p>
        </div>

        <div className="glass-card p-8 animate-scale-in shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">欢迎回来</h2>
            <p className="text-gray-400">登录你的账号继续开发之旅</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">邮箱地址</label>
              <div className={`relative transition-all duration-300 ${emailFocused ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${emailFocused ? 'shadow-lg shadow-primary/20' : ''}`} />
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailFocused ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    emailFocused ? 'border-primary' : 'border-white/10'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">密码</label>
              <div className={`relative transition-all duration-300 ${passwordFocused ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${passwordFocused ? 'shadow-lg shadow-primary/20' : ''}`} />
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${passwordFocused ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    passwordFocused ? 'border-primary' : 'border-white/10'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 rounded-md border-2 border-white/20 bg-dark-700 transition-all peer-checked:bg-primary peer-checked:border-primary" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">记住我</span>
              </label>
              <Link to="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-primary/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </span>
              ) : (
                '登录账号'
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-gray-500">或者使用演示账号登录：</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin@devrealm.com', 'admin123')}
                className="py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
              >
                👑 管理员
              </button>
              <button
                onClick={() => handleDemoLogin('user@devrealm.com', 'user123')}
                className="py-2.5 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                👤 普通用户
              </button>
              <button
                onClick={() => handleDemoLogin('vip@devrealm.com', 'vip123')}
                className="py-2.5 px-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
              >
                ⭐ VIP会员
              </button>
              <button
                onClick={() => handleDemoLogin('expert@devrealm.com', 'expert123')}
                className="py-2.5 px-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2"
              >
                🏆 专家
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-800/50 text-gray-500">或使用以下方式登录</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-dark-700/50 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all group">
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">GitHub</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-dark-700/50 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Twitter</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            还没有账号？{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              立即注册
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          © 2024 DevRealm. 保留所有权利。
        </p>
      </div>
    </div>
  );
}