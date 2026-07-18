export default function NoteCard({ note, onDelete }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '20px', margin: '15px 0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b' }}>{note.title}</h4>
          <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '12px' }}>
            {note.subject || 'Uncategorized'}
          </span>
        </div>
        <button 
          onClick={() => onDelete(note._id)} 
          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          Delete
        </button>
      </div>
      <p style={{ marginTop: '15px', color: '#334155', lineHeight: '1.5' }}>{note.content}</p>
    </div>
  );
}