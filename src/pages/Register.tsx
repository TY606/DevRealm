import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Gamepad2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      id: 'new-' + Date.now(),
      email,
      username,
      bio: '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      role: 'user' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reputation: 0,
      level: 1,
    };

    login(newUser, 'mock-token-' + Date.now());
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="register-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#register-grid)" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary via-cyan-500 to-primary mb-6 shadow-2xl shadow-secondary/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gradient mb-3">DevRealm</h1>
          <p className="text-gray-400">加入游戏开发者社区</p>
        </div>

        <div className="glass-card p-8 animate-scale-in shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">创建账号</h2>
            <p className="text-gray-400">开启你的游戏开发之旅</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">用户名</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focusedField === 'username' ? 'shadow-lg shadow-primary/20' : ''}`} />
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="请输入用户名"
                  className={`w-full pl-12 pr-4 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    focusedField === 'username' ? 'border-primary' : 'border-white/10'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">邮箱地址</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'shadow-lg shadow-primary/20' : ''}`} />
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    focusedField === 'email' ? 'border-primary' : 'border-white/10'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">密码</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'shadow-lg shadow-primary/20' : ''}`} />
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    focusedField === 'password' ? 'border-primary' : 'border-white/10'
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

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">确认密码</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${focusedField === 'confirmPassword' ? 'shadow-lg shadow-primary/20' : ''}`} />
                <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-gray-500'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-14 py-4 bg-dark-700/80 border rounded-xl outline-none transition-all text-white placeholder-gray-500 ${
                    focusedField === 'confirmPassword' ? 'border-primary' : 'border-white/10'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" required />
                <div className="w-5 h-5 rounded-md border-2 border-white/20 bg-dark-700 transition-all peer-checked:bg-primary peer-checked:border-primary" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                我同意{' '}
                <Link to="#" className="text-primary hover:text-primary/80 transition-colors">服务条款</Link>{' '}
                和{' '}
                <Link to="#" className="text-primary hover:text-primary/80 transition-colors">隐私政策</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-primary/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  注册中...
                </span>
              ) : (
                '创建账号'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              立即登录
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