import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Terminal, Zap, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: 'radial-gradient(ellipse at top, var(--editor-bg) 0%, var(--background-color) 100%)'
      }}>
        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: '0 0 1.5rem 0', background: 'linear-gradient(to right, #ec4899, #6366f1)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Next-Gen DSA Learning
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--subtext-color)', marginBottom: '3rem', lineHeight: '1.6' }}>
            Elevate your coding skills with the ultimate AI-Driven platform. We don't just tell you that your code failed—our <strong style={{color: 'var(--text-color)'}}>Error DNA</strong> engine analyzes your logic, finds edge cases, and personalizes your curriculum to master Data Structures and Algorithms.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/auth" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}>
              Start Coding Now <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', marginTop: '5rem' }}>
          {[
            { icon: <Terminal size={32} color="#ec4899" />, title: 'Multi-Language IDE', desc: 'Secure browser-based execution for C++, Java, Python, and JS.' },
            { icon: <Brain size={32} color="#6366f1" />, title: 'Error DNA Engine', desc: 'AI analyzes your stack traces to categorize your mistakes intelligently.' },
            { icon: <Zap size={32} color="#f59e0b" />, title: 'Dynamic Curriculums', desc: 'Personalized problem recommendations target your specific weak points.' },
            { icon: <Shield size={32} color="#10b981" />, title: 'Admin Controls', desc: 'Add new problems, hide test cases, and manage the student base easily.' },
          ].map((feature, i) => (
            <div key={i} style={{ backgroundColor: 'var(--secondary-color)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div>{feature.icon}</div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>{feature.title}</h3>
              <p style={{ margin: 0, color: 'var(--subtext-color)', lineHeight: '1.5' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
