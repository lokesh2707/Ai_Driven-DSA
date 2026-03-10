import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, CheckCircle2 } from 'lucide-react';

export default function ProblemList({ authUser }) {
    const [problems, setProblems] = useState([]);
    const [search, setSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [solvedIds, setSolvedIds] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/problems`)
            .then(res => setProblems(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (authUser) {
            axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/${authUser.id}/solved`)
                .then(res => setSolvedIds(res.data))
                .catch(err => console.error(err));
        }
    }, [authUser]);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesDiff && matchesCategory;
    });

    const getStats = (catName, fixedTotal) => {
        const catProbs = problems.filter(p => p.category === catName);
        const total = fixedTotal; // fixed to standard leetcode counts
        const solved = catProbs.filter(p => solvedIds.includes(String(p._id || p.id))).length;
        const percent = total > 0 ? (solved / total) * 100 : 0;
        return { solved, total, percent };
    };

    const stats150 = getStats('Top Interview 150', 150);
    const stats75 = getStats('AI Driven 75', 75);
    const stats50 = getStats('SQL 50', 50);

    return (
        <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            
            {/* Top gamified header */}
            <div style={{display: 'flex', gap: '1.5rem', width: '100%', overflowX: 'auto', paddingBottom: '0.5rem'}}>
                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'Top Interview 150' ? 'All' : 'Top Interview 150')}
                    style={{flex: '1', minWidth: '300px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${categoryFilter === 'Top Interview 150' ? '#3b82f6' : 'var(--border-color)'}`, display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'linear-gradient(to right bottom, rgba(59, 130, 246, 0.1), transparent)', cursor: 'pointer', transition: 'all 0.2s', transform: categoryFilter === 'Top Interview 150' ? 'scale(1.02)' : 'scale(1)'}}>
                    <h3 style={{margin: 0, color: '#3b82f6', fontSize: '1.25rem'}}>Top Interview 150 {categoryFilter === 'Top Interview 150' && '✓'}</h3>
                    <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--subtext-color)', lineHeight: '1.4'}}>Must-do list for interview prep. Curated from top tech companies.</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                        <div style={{width: '70%', height: '6px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${stats150.percent}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.5s ease-out'}}></div></div>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: 'bold'}}>{stats150.solved} / {stats150.total}</span>
                    </div>
                </div>

                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'AI Driven 75' ? 'All' : 'AI Driven 75')}
                    style={{flex: '1', minWidth: '300px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${categoryFilter === 'AI Driven 75' ? '#10b981' : 'var(--border-color)'}`, display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'linear-gradient(to right bottom, rgba(16, 185, 129, 0.1), transparent)', cursor: 'pointer', transition: 'all 0.2s', transform: categoryFilter === 'AI Driven 75' ? 'scale(1.02)' : 'scale(1)'}}>
                    <h3 style={{margin: 0, color: 'var(--success-color)', fontSize: '1.25rem'}}>AI Driven 75 {categoryFilter === 'AI Driven 75' && '✓'}</h3>
                    <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--subtext-color)', lineHeight: '1.4'}}>Essential 75 questions to master Data Structures and Algorithms.</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                        <div style={{width: '70%', height: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${stats75.percent}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.5s ease-out'}}></div></div>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: 'bold'}}>{stats75.solved} / {stats75.total}</span>
                    </div>
                </div>

                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'SQL 50' ? 'All' : 'SQL 50')}
                    style={{flex: '1', minWidth: '300px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${categoryFilter === 'SQL 50' ? '#f59e0b' : 'var(--border-color)'}`, display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'linear-gradient(to right bottom, rgba(245, 158, 11, 0.1), transparent)', cursor: 'pointer', transition: 'all 0.2s', transform: categoryFilter === 'SQL 50' ? 'scale(1.02)' : 'scale(1)'}}>
                    <h3 style={{margin: 0, color: '#f59e0b', fontSize: '1.25rem'}}>SQL 50 {categoryFilter === 'SQL 50' && '✓'}</h3>
                    <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--subtext-color)', lineHeight: '1.4'}}>Crack SQL interviews. Fundamental to advanced database querying.</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                        <div style={{width: '70%', height: '6px', backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${stats50.percent}%`, height: '100%', backgroundColor: '#f59e0b', transition: 'width 0.5s ease-out'}}></div></div>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: 'bold'}}>{stats50.solved} / {stats50.total}</span>
                    </div>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 style={{margin: 0}}>Problem Set</h2>
                
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                        <Search size={18} style={{position: 'absolute', left: '10px', color: 'var(--subtext-color)'}} />
                        <input 
                            type="text" 
                            placeholder="Search problems..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem 0.5rem 2.5rem', 
                                borderRadius: '20px', 
                                border: '1px solid var(--border-color)', 
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)'}}>
                        <Filter size={16} color="var(--subtext-color)" />
                        <select 
                            value={difficultyFilter} 
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            style={{background: 'transparent', border: 'none', color: 'var(--text-color)', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '0.5rem'}}
                        >
                            <option value="All">Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                    <thead>
                        <tr style={{borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary-color)'}}>
                            <th style={{padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600, width: '40px'}}>Status</th>
                            <th style={{padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600}}>Title</th>
                            <th style={{padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600}}>Acceptance</th>
                            <th style={{padding: '1rem', color: 'var(--subtext-color)', fontWeight: 600}}>Difficulty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{padding: '2rem', textAlign: 'center', color: 'var(--subtext-color)'}}>
                                    No matching problems found.
                                </td>
                            </tr>
                        ) : (
                            filteredProblems.map((p, index) => (
                                <tr key={p._id || p.id} style={{
                                    borderBottom: '1px solid var(--border-color)', 
                                    backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--secondary-color)',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <td style={{padding: '1rem', textAlign: 'center'}}>
                                        {solvedIds.includes(String(p._id || p.id)) ? (
                                            <CheckCircle2 size={20} color="var(--success-color)" />
                                        ) : (
                                            <CheckCircle2 size={20} color="var(--border-color)" style={{opacity: 0.3}} />
                                        )}
                                    </td>
                                    <td style={{padding: '1rem'}}>
                                        <Link to={`/problems/${p._id || p.id}`} style={{color: 'var(--text-color)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s'}} 
                                              onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
                                              onMouseOut={(e) => e.target.style.color = 'var(--text-color)'}
                                        >
                                            {p.title}
                                        </Link>
                                    </td>
                                    <td style={{padding: '1rem', color: 'var(--text-color)'}}>
                                        {String((Math.random() * 40 + 40).toFixed(1))}% 
                                    </td>
                                    <td style={{padding: '1rem'}}>
                                        <span style={{
                                            color: p.difficulty === 'Easy' ? 'var(--success-color)' : p.difficulty === 'Medium' ? '#f59e0b' : 'var(--error-color)',
                                            fontWeight: 500
                                        }}>
                                            {p.difficulty}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
