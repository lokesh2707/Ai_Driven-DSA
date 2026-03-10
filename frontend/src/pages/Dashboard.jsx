import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Link2, Github, BookOpen, Clock, Code2, AlertTriangle, Cpu, TrendingUp } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

export default function Dashboard({ authUser }) {
    const [data, setData] = useState({ 
        stats: { solvedProblems: 0, totalSubmissions: 0, easy: {}, medium: {}, hard: {}, streak: 0, activeDays: 0 }, 
        errorDNA: [], 
        recentInsights: [], 
        recommendations: [],
        recentSubmissions: [] 
    });

    useEffect(() => {
        if (!authUser) return;
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/${authUser.id}/dna`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, [authUser]);

    const totalProblems = (data.stats.easy?.total || 0) + (data.stats.medium?.total || 0) + (data.stats.hard?.total || 0) || 1;
    const progressPercentage = (data.stats.solvedProblems / totalProblems) * 100;

    return (
        <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '2rem'}}>
            
            {/* Left Sidebar (User Profile) */}
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        <div style={{width: '72px', height: '72px', borderRadius: '12px', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 'bold'}}>
                           {authUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 style={{margin: 0, fontSize: '1.25rem', color: 'var(--text-color)'}}>{authUser?.username || 'User'}</h2>
                            <span style={{color: 'var(--subtext-color)', fontSize: '0.9rem'}}>Rank ~ 168,231</span>
                        </div>
                    </div>
                    
                    <button style={{width: '100%', padding: '0.5rem', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', marginTop: '0.5rem'}}>Edit Profile</button>
                    
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', color: 'var(--subtext-color)', fontSize: '0.9rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BookOpen size={16}/> {authUser?.college || 'Add College/University'}</div>
                        {authUser?.github && <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Github size={16}/> {authUser.github}</div>}
                    </div>

                    {authUser?.aiResumeAnalysis && (
                        <div style={{marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem'}}>
                            <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)'}}>
                                <Cpu size={18}/> AI Curriculum Summary
                            </h3>
                            {authUser.resumeSkills && authUser.resumeSkills.length > 0 && (
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem'}}>
                                    {authUser.resumeSkills.map((skill, i) => (
                                        <span key={i} style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '16px', fontSize: '0.85rem', color: '#10b981', textTransform: 'capitalize', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div style={{fontSize: '0.9rem', color: 'var(--text-color)', backgroundColor: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #6366f1', lineHeight: 1.6, marginTop: '1rem'}}>
                                <strong style={{color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem'}}>🤖 AI Curriculum Plan</strong> 
                                {authUser.aiResumeAnalysis}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem'}}>
                    <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Cpu size={18}/> Recommended Focus</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                        {data.recommendations?.map((r, i) => (
                            <span key={i} style={{backgroundColor: 'var(--secondary-color)', padding: '0.3rem 0.6rem', borderRadius: '16px', fontSize: '0.85rem', color: 'var(--text-color)'}}>{r}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Main Panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {data.stats.solvedProblems === 0 && data.stats.totalSubmissions === 0 && (
                    <div style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <h3 style={{margin: '0 0 0.5rem 0', color: 'var(--text-color)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>🚀 Welcome to AI Driven DSA!</h3>
                            <p style={{margin: 0, color: 'var(--subtext-color)', fontSize: '0.95rem'}}>Your journey begins here. We recommend starting with the classic "Two Sum" problem to familiarize yourself with the platform.</p>
                        </div>
                        <a href="/problems" style={{backgroundColor: '#6366f1', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '500', display: 'inline-block'}}>Solve Your First Problem</a>
                    </div>
                )}

                {/* Stats & Streaks Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1fr', gap: '1.5rem' }}>
                   
                   {/* Solved Problems Ring */}
                    <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem'}}>
                        <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'var(--subtext-color)'}}>Solved Problems</h3>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                            
                            <div style={{position: 'relative', width: '120px', height: '120px'}}>
                               <svg viewBox="0 0 36 36" style={{width: '100%', height: '100%', strokeDasharray: '100', strokeLinecap: 'round', transform: 'rotate(-90deg)'}}>
                                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--secondary-color)" strokeWidth="1.5"></circle>
                                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray={`${progressPercentage}, 100`}></circle>
                               </svg>
                               <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                                   <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)', lineHeight: 1}}>{data.stats.solvedProblems}</div>
                                   <div style={{fontSize: '0.75rem', color: 'var(--subtext-color)'}}>Solved</div>
                               </div>
                            </div>
                            
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem'}}><span style={{color: '#10b981'}}>Easy</span><span><strong style={{color: 'var(--text-color)'}}>{data.stats.easy?.solved || 0}</strong> <span style={{color: 'var(--subtext-color)'}}>/ {data.stats.easy?.total || 250}</span></span></div>
                                    <div style={{height: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${((data.stats.easy?.solved || 0)/250)*100}%`, height: '100%', backgroundColor: '#10b981'}}></div></div>
                                </div>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem'}}><span style={{color: '#f59e0b'}}>Medium</span><span><strong style={{color: 'var(--text-color)'}}>{data.stats.medium?.solved || 0}</strong> <span style={{color: 'var(--subtext-color)'}}>/ {data.stats.medium?.total || 500}</span></span></div>
                                    <div style={{height: '6px', backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${((data.stats.medium?.solved || 0)/500)*100}%`, height: '100%', backgroundColor: '#f59e0b'}}></div></div>
                                </div>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem'}}><span style={{color: '#ef4444'}}>Hard</span><span><strong style={{color: 'var(--text-color)'}}>{data.stats.hard?.solved || 0}</strong> <span style={{color: 'var(--subtext-color)'}}>/ {data.stats.hard?.total || 150}</span></span></div>
                                    <div style={{height: '6px', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '3px', overflow: 'hidden'}}><div style={{width: `${((data.stats.hard?.solved || 0)/150)*100}%`, height: '100%', backgroundColor: '#ef4444'}}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Streak Box */}
                    <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                             <div style={{textAlign: 'center'}}>
                                 <div style={{color: 'var(--subtext-color)', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Current Streak</div>
                                 <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'}}><TrendingUp size={20} color="var(--primary-color)"/> {data.stats.streak}</div>
                             </div>
                             <div style={{textAlign: 'center'}}>
                                 <div style={{color: 'var(--subtext-color)', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Total Active Days</div>
                                 <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)'}}>{data.stats.activeDays}</div>
                             </div>
                             <div style={{textAlign: 'center'}}>
                                 <div style={{color: 'var(--subtext-color)', fontSize: '0.85rem', marginBottom: '0.3rem'}}>Submissions</div>
                                 <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)'}}>{data.stats.totalSubmissions}</div>
                             </div>
                         </div>
                         <div style={{flex: 1, backgroundColor: 'var(--secondary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--subtext-color)', fontSize: '0.85rem', flexDirection: 'column', gap: '0.5rem'}}>
                            <Code2 size={24} style={{opacity: 0.5}}/>
                            <span>No Badges Earned Yet (Top 10%)</span>
                         </div>
                    </div>
                </div>

                {/* Bottom Row - AI Insights & Submissions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1fr', gap: '1.5rem' }}>
                    
                    {/* Recent Insights & Error DNA */}
                    <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem'}}>
                        <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={18} color="#ec4899" /> AI Logic Insights</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                            {data.recentInsights.length > 0 ? data.recentInsights.map((insight, i) => (
                                <div key={i} style={{padding: '0.75rem 1rem', backgroundColor: 'rgba(236, 72, 153, 0.05)', borderRadius: '8px', borderLeft: '3px solid #ec4899', fontSize: '0.9rem', color: 'var(--text-color)'}}>
                                    {insight}
                                </div>
                            )) : (
                                <p style={{opacity: 0.5, fontSize: '0.9rem'}}>No logic insights available yet.</p>
                            )}
                        </div>

                        <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--subtext-color)'}}>Error DNA Breakdown</h3>
                        {data.errorDNA.length > 0 ? (
                            <div style={{height: '180px'}}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={data.errorDNA} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2}>
                                            {data.errorDNA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)'}} itemStyle={{color: 'var(--text-color)', fontSize: '0.85rem'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div style={{height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--subtext-color)', fontSize: '0.9rem'}}>Start solving to build DNA.</div>
                        )}
                    </div>

                    {/* Recent Submissions Table */}
                    <div style={{backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                         <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={18} /> Recent Submissions</h3>
                         {data.recentSubmissions && data.recentSubmissions.length > 0 ? (
                             <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
                                 <thead>
                                     <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                                         <th style={{padding: '0.5rem 0', textAlign: 'left', color: 'var(--subtext-color)'}}>Problem</th>
                                         <th style={{padding: '0.5rem 0', textAlign: 'left', color: 'var(--subtext-color)'}}>Status</th>
                                         <th style={{padding: '0.5rem 0', textAlign: 'left', color: 'var(--subtext-color)'}}>Lang</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {data.recentSubmissions.map((sub, i) => (
                                         <tr key={i} style={{borderBottom: '1px solid var(--border-color)'}}>
                                             <td style={{padding: '0.75rem 0', fontWeight: '500', color: 'var(--text-color)'}}>{sub.title}</td>
                                             <td style={{padding: '0.75rem 0', color: sub.status === 'Accepted' ? 'var(--success-color)' : (sub.status === 'System Error' ? '#f59e0b' : 'var(--error-color)')}}>{sub.status}</td>
                                             <td style={{padding: '0.75rem 0'}}><span style={{backgroundColor: 'var(--secondary-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-color)'}}>{sub.language}</span></td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         ) : (
                            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--subtext-color)', fontSize: '0.9rem'}}>
                                No submissions yet. Time to code!
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
}
