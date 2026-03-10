import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Code, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddProblem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    topics: '',
    testCases: [{ input: '', expectedOutput: '', isHidden: false }],
    starterCode: {
      javascript: '',
      python: '',
      java: '',
      cpp: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarterCodeChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: value
      }
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases: newTestCases }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length <= 1) return;
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, testCases: newTestCases }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Process topics into array
    const processedTopics = formData.topics
      .split(',')
      .map(t => t.trim())
      .filter(t => t);

    const dataToSend = {
      ...formData,
      topics: processedTopics
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/problems`, dataToSend);
      navigate('/problems');
    } catch (error) {
      console.error('Error adding problem:', error);
      alert('Failed to add problem. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="problem-panel" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '2rem', color: '#fff' }}>
          <Code color="#6366f1" /> Create New Problem
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Problem Title</label>
            <input 
              type="text" 
              className="form-control" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Find the Largest Element" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Description (Markdown supported implicitly)</label>
            <textarea 
              className="form-control" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Detailed description of the problem..." 
              rows="4"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Difficulty</label>
              <select className="form-control" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <label>Topics (comma separated)</label>
              <input 
                type="text" 
                className="form-control" 
                name="topics" 
                value={formData.topics} 
                onChange={handleChange} 
                placeholder="e.g. Arrays, Sorting, Math" 
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1a2e', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Test Cases</h3>
              <button type="button" className="btn btn-primary" onClick={addTestCase} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add 
              </button>
            </div>

            {formData.testCases.map((tc, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', backgroundColor: 'var(--input-bg)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Input</label>
                  <textarea 
                    className="form-control" 
                    value={tc.input} 
                    onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)} 
                    placeholder="e.g. 2 5 1 8" 
                    rows="2" 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Expected Output</label>
                  <textarea 
                    className="form-control" 
                    value={tc.expectedOutput} 
                    onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)} 
                    placeholder="e.g. 8" 
                    rows="2" 
                    required 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={tc.isHidden} 
                        onChange={(e) => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                      />
                      Hidden
                    </label>
                    <button type="button" onClick={() => removeTestCase(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#1a1a2e', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Starter Code</h3>
            
            {['javascript', 'python', 'java', 'cpp'].map((lang) => (
              <div key={lang} className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ textTransform: 'capitalize' }}>{lang}</label>
                <textarea 
                  className="code-editor" 
                  style={{ width: '100%', minHeight: '80px', boxSizing: 'border-box' }}
                  value={formData.starterCode[lang]} 
                  onChange={(e) => handleStarterCodeChange(lang, e.target.value)} 
                  placeholder={`Starter code for ${lang}...`}
                  spellCheck="false"
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }} disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner">Saving...</span> : <><Save size={18} /> Publish Problem</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
