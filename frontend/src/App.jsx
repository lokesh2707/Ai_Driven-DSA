import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Activity, Code2, LayoutDashboard, Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ProblemList from './pages/ProblemList';
import CodingWorkspace from './pages/CodingWorkspace';
import AddProblem from './pages/AddProblem';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import { PlusCircle, LogOut, Shield } from 'lucide-react';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setAuthUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
  };

  return (
    <Router>
      <header className="app-header">
        <div className="logo">
          <Activity color="#ec4899" />
          AI Driven DSA
        </div>
        
        <nav style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          {authUser && (
            <Link to="/" style={{color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}
          <Link to="/problems" style={{color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Code2 size={18} /> Problems
          </Link>
          {authUser && authUser.role === 'admin' && (
            <Link to="/admin" style={{color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f59e0b', padding: '0.4rem 0.8rem', borderRadius: '20px'}}>
              <Shield size={16} /> Admin Panel
            </Link>
          )}
        </nav>

        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {authUser ? (
            <>
              <span style={{ fontWeight: '500', color: 'var(--success-color)' }}>{authUser.username}</span>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/auth" style={{color: '#fff', textDecoration: 'none', backgroundColor: '#ec4899', padding: '0.4rem 1rem', borderRadius: '20px'}}>Sign In</Link>
          )}
        </div>
      </header>
      
      <Routes>
        <Route path="/auth" element={!authUser ? <Auth setAuthUser={setAuthUser} /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <Dashboard authUser={authUser} /> : <Landing />} />
        <Route path="/problems" element={<ProblemList authUser={authUser} />} />
        <Route path="/problems/new" element={authUser && authUser.role === 'admin' ? <AddProblem /> : <Navigate to="/" />} />
        <Route path="/problems/:id" element={authUser ? <CodingWorkspace authUser={authUser} /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={authUser && authUser.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
