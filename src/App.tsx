import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/utils/mockData';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Forum from '@/pages/Forum';
import AI from '@/pages/AI';
import Publish from '@/pages/Publish';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';

function App() {
  const { login, isAuthenticated, role } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('devrealm_user');
    const savedToken = localStorage.getItem('devrealm_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        login(userData, savedToken);
      } catch {
        localStorage.removeItem('devrealm_user');
        localStorage.removeItem('devrealm_token');
      }
    }
    
    setLoading(false);
  }, [login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<Forum />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/publish" element={<Publish />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={role === 'admin' ? <Admin /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;