import { useState } from 'react';
import axios from 'axios';

export default function NoteForm({ onAdd }) {
  const [formData, setFormData] = useState({ title: '', subject: '', content: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/notes', formData);
      onAdd(res.data);
      setFormData({ title: '', subject: '', content: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving note. Is the server running?');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
      <h3 style={{ marginTop: 0 }}>Add a New Note</h3>
      {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
      
      <input 
        type="text" 
        placeholder="Title" 
        required
        value={formData.title} 
        onChange={e => setFormData({...formData, title: e.target.value})}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
      />
      
      <input 
        type="text" 
        placeholder="Subject"
        value={formData.subject} 
        onChange={e => setFormData({...formData, subject: e.target.value})}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
      />
      
      <textarea 
        placeholder="e.g., Shiksha-Co-Grader: RAG multi-agent framework aiming to reduce grading time by 40%..." 
        required 
        rows="4"
        value={formData.content} 
        onChange={e => setFormData({...formData, content: e.target.value})}
        style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
      />
      
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Save Note
      </button>
    </form>
  );
}