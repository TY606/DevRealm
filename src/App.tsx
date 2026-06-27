import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Forum from '@/pages/Forum';
import AI from '@/pages/AI';
import Publish from '@/pages/Publish';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import GameManagement from '@/pages/admin/GameManagement';
import SecurityCenter from '@/pages/admin/SecurityCenter';
import AuditLog from '@/pages/admin/AuditLog';
import SystemSettings from '@/pages/admin/SystemSettings';
import DatabaseManagement from '@/pages/admin/DatabaseManagement';

function App() {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <main>
                  <Home />
                </main>
              </>
            } 
          />
          <Route 
            path="/forum" 
            element={
              <>
                <Navbar />
                <main>
                  <Forum />
                </main>
              </>
            } 
          />
          <Route 
            path="/forum/:id" 
            element={
              <>
                <Navbar />
                <main>
                  <Forum />
                </main>
              </>
            } 
          />
          <Route 
            path="/ai" 
            element={
              <>
                <Navbar />
                <main>
                  <AI />
                </main>
              </>
            } 
          />
          <Route 
            path="/publish" 
            element={
              <>
                <Navbar />
                <main>
                  <Publish />
                </main>
              </>
            } 
          />
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
            element={
              isAuthenticated ? (
                <>
                  <Navbar />
                  <main>
                    <Profile />
                  </main>
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/admin/*" 
            element={role === 'admin' ? <AdminLayout /> : <Navigate to="/" />} 
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<ContentModeration />} />
            <Route path="games" element={<GameManagement />} />
            <Route path="security" element={<SecurityCenter />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="database" element={<DatabaseManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;