import { useState } from 'react';

const AddTaskForm = ({ columnId, boardId, onAdd, onCancel }) => {
  const [title, setTitle]       = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd({ title: title.trim(), priority, columnId, boardId });
    setLoading(false);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        style={styles.textarea}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Enter task title...'
        autoFocus
        rows={2}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
      </select>
      <div style={styles.actions}>
        <button type='submit' style={styles.addBtn} disabled={loading || !title.trim()}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
        <button type='button' onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
      </div>
    </form>
  );
};

const styles = {
  form:      { marginTop:'8px' },
  textarea:  { width:'100%', padding:'8px', border:'2px solid #0052CC',
               borderRadius:'4px', fontSize:'14px', resize:'none',
               fontFamily:'inherit', boxSizing:'border-box' },
  select:    { width:'100%', padding:'6px', marginTop:'6px', border:'1px solid #dfe1e6',
               borderRadius:'4px', fontSize:'13px', marginBottom:'8px' },
  actions:   { display:'flex', gap:'8px', alignItems:'center' },
  addBtn:    { padding:'6px 14px', background:'#0052CC', color:'#fff',
               border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
  cancelBtn: { padding:'6px 10px', background:'none', border:'none',
               color:'#5e6c84', cursor:'pointer', fontSize:'13px' }
};
export default AddTaskForm;
