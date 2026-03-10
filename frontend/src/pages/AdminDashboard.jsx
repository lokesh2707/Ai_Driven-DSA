import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Trash2, Users, Code, Activity, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ usersCount: 0, problemsCount: 0, submissionsCount: 0 });
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, probsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/stats`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/problems`)
      ]);
      setStats(statsRes.data);
      setProblems(probsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/problems/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#f59e0b' }}>
        <Shield size={32} />
        <h2 style={{ margin: 0, color: '#f59e0b' }}>Admin Control Center</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        <div className="problem-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right bottom, var(--secondary-color), var(--card-bg))' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
            <Users size={32} color="#3b82f6" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--subtext-color)', fontSize: '1rem' }}>Total Users</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.usersCount}</div>
          </div>
        </div>

        <div className="problem-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right bottom, var(--secondary-color), var(--card-bg))' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <Code size={32} color="#10b981" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--subtext-color)', fontSize: '1rem' }}>Active Problems</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.problemsCount}</div>
          </div>
        </div>

        <div className="problem-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right bottom, var(--secondary-color), var(--card-bg))' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px' }}>
            <Activity size={32} color="#ec4899" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--subtext-color)', fontSize: '1rem' }}>Code Submissions</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.submissionsCount}</div>
          </div>
        </div>
      </div>

      <div className="problem-panel" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Problem Management Library</h3>
          <Link to="/problems/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Add Problem</Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Title</th>
              <th style={{ padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Difficulty</th>
              <th style={{ padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Topics</th>
              <th style={{ padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600, borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => (
              <tr key={p._id || p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}><Link to={`/problems/${p._id || p.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>{p.title}</Link></td>
                <td style={{ padding: '1rem' }}>
                  <span style={{color: p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'}}>{p.difficulty}</span>
                </td>
                <td style={{ padding: '1rem' }}>{p.topics?.join(', ')}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(p._id || p.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
