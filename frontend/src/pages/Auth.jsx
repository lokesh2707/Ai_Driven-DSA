import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ChevronRight, Key } from 'lucide-react';

export default function Auth({ setAuthUser }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', adminKey: '', college: '', github: '', resume: null });
  const [isAdminRegistration, setIsAdminRegistration] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
       setFormData({ ...formData, resume: e.target.files[0] });
    } else {
       setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      let dataToSend = formData;
      let headers = {};
      
      if (!isLogin && formData.resume) {
         dataToSend = new FormData();
         for (const key in formData) {
             if (formData[key]) dataToSend.append(key, formData[key]);
         }
         headers = { 'Content-Type': 'multipart/form-data' };
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${endpoint}`, dataToSend, { headers });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuthUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="problem-panel" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', color: '#6366f1', marginBottom: '2rem', fontSize: '1.8rem' }}>
          {isLogin ? 'Welcome Back' : (isAdminRegistration ? 'Admin Access' : 'Create Account')}
        </h2>
        
        {error && <div style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Username</label>
              <input 
                type="text" 
                name="username"
                className="form-control" 
                value={formData.username} 
                onChange={handleChange} 
                required={!isLogin} 
                placeholder="Coder123"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🎓 College / University</label>
              <input 
                type="text" 
                name="college"
                className="form-control" 
                value={formData.college} 
                onChange={handleChange} 
                required={!isLogin} 
                placeholder="Stanford University"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🐈 GitHub ID</label>
                  <input 
                    type="text" 
                    name="github"
                    className="form-control" 
                    value={formData.github} 
                    onChange={handleChange} 
                    required={!isLogin} 
                    placeholder="octocat"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📄 Resume Upload (.pdf)</label>
                  <input 
                    type="file" 
                    accept=".pdf"
                    name="resume"
                    className="form-control" 
                    onChange={handleChange} 
                    style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                  />
                </div>
            </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />
          </div>

          {!isLogin && isAdminRegistration && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}><Key size={16} /> Admin Secret Key</label>
              <input 
                type="password" 
                name="adminKey"
                className="form-control" 
                style={{ borderColor: '#f59e0b' }}
                value={formData.adminKey} 
                onChange={handleChange} 
                required 
                placeholder="Enter secret to register as admin"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ec4899', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { 
                setIsLogin(!isLogin); 
                setIsAdminRegistration(false); 
                setFormData({ username: '', email: '', password: '', adminKey: '', college: '', github: '', resume: null });
                setError('');
            }} 
            style={{ color: '#ec4899', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

        {!isLogin && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
             <label style={{ cursor: 'pointer', opacity: 0.6, fontSize: '0.8rem' }}>
               <input 
                 type="checkbox" 
                 checked={isAdminRegistration} 
                 onChange={(e) => setIsAdminRegistration(e.target.checked)} 
                 style={{ marginRight: '0.5rem' }}
               />
               Register as Administrator
             </label>
          </div>
        )}
      </div>
    </main>
  );
}
