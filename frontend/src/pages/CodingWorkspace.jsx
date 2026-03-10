import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Terminal, Lightbulb, Activity, Play, FileCode2, Clock, CheckCircle2, History, MessageSquare, BookOpen, Layers } from 'lucide-react';
import axios from 'axios';

export default function CodingWorkspace({ authUser }) {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Loading...');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // LeetCode style tabs
  const [leftTab, setLeftTab] = useState('description');
  const [bottomTab, setBottomTab] = useState('testcases');
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (leftTab === 'submissions' && authUser) {
      axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/submissions/${id}/${authUser.id}`)
        .then(res => setSubmissions(res.data))
        .catch(err => console.error(err));
    }
  }, [leftTab, id, authUser]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/problems/${id}`)
      .then(res => {
        setProblem(res.data);
        if (res.data.starterCode && res.data.starterCode[language]) {
            setCode(res.data.starterCode[language]);
        } else {
            setCode('function solve() {\n  // Write your code here\n}');
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (problem?.starterCode?.[language]) {
        setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  const executeCode = async (isSubmit = false) => {
    setLoading(true);
    setResult(null);
    setBottomTab('result'); // Auto-switch to result tab
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/run-code`, {
        code,
        language,
        problemId: problem._id || id,
        userId: authUser?.id || 'lokesh',
        isSubmit
      });
      setResult({...response.data, isSubmit});
      
      if (isSubmit) {
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/submissions/${id}/${authUser?.id}`)
            .then(res => setSubmissions(res.data))
            .catch(err => console.error(err));
      }
      
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setResult({
        status: 'System Error',
        failedTestCase: { input: '', expectedOutput: '', actualOutput: '' },
        errorDetails: {
            errorType: 'connection_error',
            explanation: 'Failed to connect to the execution server.'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <main className="main-content" style={{ display: 'flex', gap: '1rem', padding: '1rem', height: 'calc(100vh - 70px)', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      {/* Left Pane - Problem Description & Tabs */}
      <div className="problem-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        
        {/* Left Tabs Header */}
        <div style={{ display: 'flex', backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)', padding: '0 0.5rem' }}>
          {[
            { id: 'description', label: 'Description', icon: <FileCode2 size={16} /> },
            { id: 'editorial', label: 'Editorial', icon: <BookOpen size={16} /> },
            { id: 'solutions', label: 'Solutions', icon: <MessageSquare size={16} /> },
            { id: 'submissions', label: 'Submissions', icon: <History size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setLeftTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'none',
                border: 'none',
                color: leftTab === tab.id ? 'var(--text-color)' : 'var(--subtext-color)',
                borderBottom: leftTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: leftTab === tab.id ? 600 : 400,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Left Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {leftTab === 'description' && (
            <>
                <h2 style={{margin: '0 0 1rem 0', fontSize: '1.5rem'}}>{problem.title}</h2>
                <div style={{display: 'flex', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem', alignItems: 'center'}}>
                    <span style={{
                        color: problem.difficulty === 'Easy' ? 'var(--success-color)' : problem.difficulty === 'Medium' ? '#f59e0b' : 'var(--error-color)',
                        backgroundColor: 'var(--secondary-color)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontWeight: 600
                    }}>{problem.difficulty}</span>
                    <span style={{color: 'var(--subtext-color)'}}>{problem.topics?.join(', ')}</span>
                </div>
                
                <div style={{marginBottom: '2rem', color: 'var(--text-color)', lineHeight: '1.7', fontSize: '1rem'}}>
                  <p style={{whiteSpace: 'pre-line'}}>{problem.description}</p>
                </div>

                {problem.testCases && problem.testCases.length > 0 && (
                  <div style={{marginBottom: '2rem'}}>
                    {problem.testCases.map((tc, idx) => (
                      <div key={idx} style={{marginBottom: '1.5rem'}}>
                        <div style={{marginBottom: '0.5rem'}}><strong style={{color: 'var(--text-color)', fontSize: '0.95rem'}}>Example {idx + 1}:</strong></div>
                        <div style={{fontFamily: 'monospace', margin: 0, backgroundColor: 'var(--secondary-color)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--border-color)', fontSize: '0.9rem'}}>
                          <div><strong style={{color: 'var(--subtext-color)'}}>Input:</strong> <span style={{color: 'var(--text-color)'}}>{String(tc.input).split('\n').join(' \\n ')}</span></div>
                          <div style={{marginTop: '0.5rem'}}><strong style={{color: 'var(--subtext-color)'}}>Output:</strong> <span style={{color: 'var(--text-color)'}}>{tc.expectedOutput}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{marginBottom: '2rem'}}>
                  <h3 style={{fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-color)'}}>Constraints:</h3>
                  <ul style={{backgroundColor: 'var(--secondary-color)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '8px', color: 'var(--text-color)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem'}}>
                     <li><code>Time Limit: 3.0s</code></li>
                     <li><code>Memory Limit: 256 MB</code></li>
                  </ul>
                </div>
            </>
          )}

          {leftTab === 'editorial' && (
             <div style={{color: 'var(--text-color)', lineHeight: '1.7', fontSize: '1.05rem'}}>
                <h2 style={{margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><BookOpen size={20} /> Editorial</h2>
                <div style={{backgroundColor: 'var(--secondary-color)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem'}}>
                   <h3 style={{marginTop: 0, color: 'var(--primary-color)'}}>Intuition</h3>
                   <p>The problem asks us to implement the logic for this specific challenge. The naive approach would take O(N^2) time by using nested loops, which could result in a Time Limit Exceeded error for larger constraints. Instead, we can optimize this by utilizing appropriate data structures such as Hash Maps, Two Pointers, or Dynamic Programming depending on the problem type to reduce the time complexity down to O(N) or O(N log N).</p>
                   <h3 style={{color: 'var(--primary-color)'}}>Approach</h3>
                   <ul style={{paddingLeft: '1.5rem'}}>
                      <li>Initialize the necessary variables or data structures.</li>
                      <li>Iterate through the given input logically based on the problem requirements.</li>
                      <li>Constantly update the current state or pointer values.</li>
                      <li>Return the accumulated or derived result at the end of the execution.</li>
                   </ul>
                   <h3 style={{color: 'var(--primary-color)'}}>Complexity</h3>
                   <ul style={{paddingLeft: '1.5rem'}}>
                      <li><strong>Time Complexity:</strong> <code style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px'}}>O(N)</code> on average for optimal solutions.</li>
                      <li><strong>Space Complexity:</strong> <code style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px'}}>O(1)</code> or <code style={{backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px'}}>O(N)</code> depending on the auxiliary space required.</li>
                   </ul>
                </div>
             </div>
          )}

          {leftTab === 'solutions' && (
             <div style={{color: 'var(--text-color)'}}>
                <h2 style={{margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MessageSquare size={20} /> Community Solutions</h2>
                <div style={{backgroundColor: 'var(--secondary-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <strong style={{fontSize: '1.1rem'}}>Optimal Javascript Solution 🚀</strong>
                      <span style={{color: 'var(--subtext-color)', fontSize: '0.85rem'}}>by CodeMaster • 202 votes</span>
                   </div>
                   <p style={{fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--subtext-color)'}}>Using a single pass and a Map. Beats 99% of submissions.</p>
                   <pre style={{backgroundColor: 'var(--code-bg)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', margin: 0}}>
                      <code style={{fontFamily: 'monospace', color: '#e2e8f0'}}>
{`// Example JS Map Approach
function solve(input) {
  const map = new Map();
  // your optimal logic here
  return result;
}`}
                      </code>
                   </pre>
                </div>
                
                <div style={{backgroundColor: 'var(--secondary-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #f59e0b'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <strong style={{fontSize: '1.1rem'}}>Clean Python Two Pointers 🐍</strong>
                      <span style={{color: 'var(--subtext-color)', fontSize: '0.85rem'}}>by AlgoNinja • 150 votes</span>
                   </div>
                   <p style={{fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--subtext-color)'}}>Very easy to read python implementation utilizing O(1) space.</p>
                   <pre style={{backgroundColor: 'var(--code-bg)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', margin: 0}}>
                      <code style={{fontFamily: 'monospace', color: '#e2e8f0'}}>
{`# Example Two Pointer Approach
def solve(arr):
    left, right = 0, len(arr) - 1
    # optimal loop here
    return result`}
                      </code>
                   </pre>
                </div>
             </div>
          )}

          {leftTab === 'submissions' && (
             <div style={{color: 'var(--text-color)'}}>
                <h2 style={{margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><History size={20} /> Your Submissions</h2>
                {submissions.length === 0 ? (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--subtext-color)'}}>
                        <History size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
                        <p>You haven't submitted any code for this problem yet.</p>
                    </div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem'}}>
                        <thead>
                            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                                <th style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)', fontWeight: 600}}>Status</th>
                                <th style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)', fontWeight: 600}}>Language</th>
                                <th style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)', fontWeight: 600}}>Runtime</th>
                                <th style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)', fontWeight: 600}}>Memory</th>
                                <th style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)', fontWeight: 600}}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub, idx) => (
                                <tr key={sub._id || idx} style={{borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                                    <td style={{padding: '0.75rem 0.5rem', fontWeight: 600, color: sub.status === 'Accepted' ? 'var(--success-color)' : (sub.status === 'System Error' ? '#f59e0b' : 'var(--error-color)')}}>{sub.status}</td>
                                    <td style={{padding: '0.75rem 0.5rem'}}><span style={{backgroundColor: 'var(--secondary-color)', padding: '0.2rem 0.4rem', borderRadius: '4px'}}>{sub.language}</span></td>
                                    <td style={{padding: '0.75rem 0.5rem'}}>{sub.runtime ? `${sub.runtime} ms` : 'N/A'}</td>
                                    <td style={{padding: '0.75rem 0.5rem'}}>{sub.memoryUsage ? `${sub.memoryUsage} MB` : 'N/A'}</td>
                                    <td style={{padding: '0.75rem 0.5rem', color: 'var(--subtext-color)'}}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
          )}
        </div>
      </div>

      {/* Right Pane - Editor & Console */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
        
        {/* Editor Area */}
        <div className="editor-panel" style={{ flex: 3, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--secondary-color)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)'}}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{padding: '0.4rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none'}}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="btn" onClick={() => executeCode(false)} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '6px', backgroundColor: 'var(--secondary-color)', color: 'var(--text-color)', border: 'none', cursor: 'pointer'}}>
                  {loading ? <Clock size={14} /> : <Play size={14} fill="currentColor" />}
                  {loading ? 'Running...' : 'Run'}
                </button>
                <button className="btn" onClick={() => executeCode(true)} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '6px', backgroundColor: 'var(--success-color)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500}}>
                  {loading ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            
            <textarea 
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{ flex: 1, border: 'none', borderRadius: 0, resize: 'none', margin: 0, padding: '1rem', fontSize: '15px' }}
            />
        </div>

        {/* Console / Testcase Area */}
        <div className="result-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            {/* Console Tabs */}
            <div style={{ display: 'flex', backgroundColor: 'var(--secondary-color)', borderBottom: '1px solid var(--border-color)', padding: '0 0.5rem' }}>
              <button
                  onClick={() => setBottomTab('testcases')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1rem', background: 'none', border: 'none',
                    color: bottomTab === 'testcases' ? 'var(--text-color)' : 'var(--subtext-color)',
                    borderBottom: bottomTab === 'testcases' ? '2px solid var(--primary-color)' : '2px solid transparent',
                    cursor: 'pointer', fontWeight: bottomTab === 'testcases' ? 600 : 400, fontSize: '0.85rem'
                  }}
              >
                 <CheckCircle2 size={14} /> Testcases
              </button>
              <button
                  onClick={() => setBottomTab('result')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1rem', background: 'none', border: 'none',
                    color: bottomTab === 'result' ? 'var(--text-color)' : 'var(--subtext-color)',
                    borderBottom: bottomTab === 'result' ? '2px solid var(--primary-color)' : '2px solid transparent',
                    cursor: 'pointer', fontWeight: bottomTab === 'result' ? 600 : 400, fontSize: '0.85rem'
                  }}
              >
                 <Terminal size={14} /> Test Result
              </button>
            </div>

            {/* Console Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              
              {bottomTab === 'testcases' && problem.testCases && (
                 <div>
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                       {problem.testCases.map((_, i) => (
                           <button 
                              key={i} 
                              onClick={() => setActiveTestCase(i)}
                              style={{
                                padding: '0.4rem 1rem', 
                                borderRadius: '6px', 
                                border: 'none', 
                                backgroundColor: activeTestCase === i ? 'var(--input-bg)' : 'transparent',
                                color: activeTestCase === i ? 'var(--text-color)' : 'var(--subtext-color)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: activeTestCase === i ? 600 : 400
                              }}
                            >
                               Case {i + 1}
                           </button>
                       ))}
                    </div>
                    
                    <div style={{marginBottom: '1rem'}}>
                      <div style={{fontSize: '0.85rem', color: 'var(--subtext-color)', marginBottom: '0.4rem'}}>Input:</div>
                      <div style={{backgroundColor: 'var(--input-bg)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', color: 'var(--text-color)', fontSize: '0.9rem'}}>
                          {problem.testCases[activeTestCase]?.input}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize: '0.85rem', color: 'var(--subtext-color)', marginBottom: '0.4rem'}}>Expected Output:</div>
                      <div style={{backgroundColor: 'var(--input-bg)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', color: 'var(--text-color)', fontSize: '0.9rem'}}>
                          {problem.testCases[activeTestCase]?.expectedOutput}
                      </div>
                    </div>
                 </div>
              )}

              {bottomTab === 'result' && (
                 <>
                  {result ? (
                    <div>
                      <h3 style={{
                          margin: '0 0 1.5rem 0', 
                          fontSize: '1.25rem',
                          color: result.status === 'Accepted' ? 'var(--success-color)' : (result.status === 'System Error' ? '#f59e0b' : 'var(--error-color)')
                      }}>
                          {result.status}
                      </h3>
                      
                      {result.status !== 'Accepted' && result.status !== 'System Error' && result.failedTestCase && (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                            <div>
                               <div style={{fontSize: '0.85rem', color: 'var(--subtext-color)', marginBottom: '0.4rem'}}>Input:</div>
                               <div style={{backgroundColor: 'var(--input-bg)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem'}}>{result.failedTestCase.input || '<hidden>'}</div>
                            </div>
                            <div>
                               <div style={{fontSize: '0.85rem', color: 'var(--subtext-color)', marginBottom: '0.4rem'}}>Output:</div>
                               <div style={{backgroundColor: 'var(--input-bg)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--error-color)'}}>{result.failedTestCase.actualOutput || ' '}</div>
                            </div>
                            <div>
                               <div style={{fontSize: '0.85rem', color: 'var(--subtext-color)', marginBottom: '0.4rem'}}>Expected:</div>
                               <div style={{backgroundColor: 'var(--input-bg)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--success-color)'}}>{result.failedTestCase.expectedOutput}</div>
                            </div>
                          </div>
                      )}
                      
                      {result.errorDetails && result.errorDetails.explanation && result.status !== 'Accepted' && (
                          <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '4px solid #6366f1'}}>
                            <h4 style={{margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)'}}>
                              <Lightbulb size={16} color="#6366f1" /> AI Explanation
                            </h4>
                            <p style={{margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-line', color: 'var(--text-color)'}}>
                              {result.errorDetails.explanation}
                            </p>
                          </div>
                      )}
                      
                      {result.status === 'Accepted' && (
                          <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--success-color)'}}>
                              <h4 style={{margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)'}}>
                                <CheckCircle2 size={16} /> All Test Cases Passed!
                              </h4>
                              <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-color)'}}>
                                {result.isSubmit ? 'Your submission was successful and saved.' : 'Your code successfully executed and passed all edge cases! Submit to save.'}
                              </p>
                            </div>
                            
                            <div style={{display: 'flex', gap: '2rem', padding: '1rem', backgroundColor: 'var(--secondary-color)', borderRadius: '8px'}}>
                              <div>
                                 <div style={{fontSize: '0.8rem', color: 'var(--subtext-color)', marginBottom: '0.2rem'}}>Runtime</div>
                                 <div style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-color)'}}>{result.runtime} <span style={{fontSize: '0.8rem', fontWeight: 400}}>ms</span></div>
                              </div>
                              <div>
                                 <div style={{fontSize: '0.8rem', color: 'var(--subtext-color)', marginBottom: '0.2rem'}}>Memory</div>
                                 <div style={{fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-color)'}}>{result.memoryUsage} <span style={{fontSize: '0.8rem', fontWeight: 400}}>MB</span></div>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--subtext-color)', opacity: 0.7}}>
                        <p>You must run your code first.</p>
                    </div>
                  )}
                 </>
              )}
            </div>
        </div>
      </div>
    </main>
  );
}
