import { useState } from 'react';
import axios from 'axios';

export default function NoteCard({ note, onDelete, onNoteUpdated }) {
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/notes/${note._id}/summarize`);
      if (onNoteUpdated) {
         onNoteUpdated(response.data);
      }
    } catch (error) {
      console.error("Error summarizing note:", error);
      alert("Failed to summarize note. Make sure your DeepSeek API key is correct in server/.env");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '20px', margin: '15px 0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>{note.title}</h4>
          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '12px' }}>
            {note.subject || 'Uncategorized'}
          </span>
        </div>
        
        {/* Updated Button Container */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSummarize} 
            disabled={isSummarizing}
            style={{ background: isSummarizing ? '#94a3b8' : '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: isSummarizing ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            {isSummarizing ? "Summarizing..." : "✨ Summarize"}
          </button>

          <button 
            onClick={() => onDelete(note._id)} 
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
            Delete
          </button>
        </div>
      </div>
      
      <p style={{ marginTop: '15px', color: '#334155', lineHeight: '1.5' }}>{note.content}</p>

      {/* NEW: AI Summary Box */}
      {note.summary && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '14px' }}>✨ AI Summary & Quiz</h4>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
            {note.summary}
          </p>
        </div>
      )}
    </div>
  );
}