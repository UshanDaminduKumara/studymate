import { useState, useEffect } from 'react';
import axios from 'axios';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  // NEW: Handles updating the state when a note gets a new summary
  const handleNoteUpdated = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#0f172a', textAlign: 'center', marginBottom: '30px' }}>StudyMate Dashboard</h1>
      
      <NoteForm onAdd={(newNote) => setNotes([newNote, ...notes])} />

      <input 
        type="search" 
        placeholder="Search by title or subject..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '16px' }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', border: '2px dashed #cbd5e1', borderRadius: '8px' }}>
          No notes yet — add your first one!
        </div>
      ) : (
        filteredNotes.map(note => (
          <NoteCard 
            key={note._id} 
            note={note} 
            onDelete={handleDelete} 
            onNoteUpdated={handleNoteUpdated} // NEW: Pass the handler down
          />
        ))
      )}
    </div>
  );
}