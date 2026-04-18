import { useState } from 'react';
import { updateTask } from '../api/taskApi';
import toast from 'react-hot-toast';

const EditTaskModal = ({ task, onClose, onTaskUpdate }) => {
  const [title, setTitle]             = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority]       = useState(task.priority || 'medium');
  const [dueDate, setDueDate]         = useState(
    task.dueDate ? task.dueDate.split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await updateTask(task._id, {
        title:       title.trim(),
        description: description.trim(),
        priority,
        dueDate:     dueDate || null,
        columnId:    task.columnId,   // keep same column
        boardId:     task.boardId,    // keep same board
      });
      onTaskUpdate(task._id, data);   // update parent state
      toast.success('Task updated!');
      onClose();
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div style={styles.modalHeader}>
          <h2 style={styles.heading}>Edit Task</h2>
          <button onClick={onClose} style={styles.closeBtn}>x</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              style={styles.select}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <input
              style={styles.input}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveBtn}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay:     { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
                 display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 },
  modal:       { background:'#fff', borderRadius:'8px', padding:'28px',
                 width:'420px', maxWidth:'90vw', boxShadow:'0 8px 32px rgba(0,0,0,0.25)' },
  modalHeader: { display:'flex', justifyContent:'space-between',
                 alignItems:'center', marginBottom:'20px' },
  heading:     { fontSize:'18px', fontWeight:'700', color:'#172b4d', margin:0 },
  closeBtn:    { background:'none', border:'none', fontSize:'22px',
                 color:'#626f86', cursor:'pointer', padding:'0 4px' },
  field:       { marginBottom:'16px' },
  label:       { display:'block', fontSize:'12px', fontWeight:'700',
                 color:'#626f86', marginBottom:'6px', textTransform:'uppercase' },
  input:       { width:'100%', padding:'10px 12px', border:'2px solid #dfe1e6',
                 borderRadius:'4px', fontSize:'14px', boxSizing:'border-box',
                 outline:'none' },
  textarea:    { width:'100%', padding:'10px 12px', border:'2px solid #dfe1e6',
                 borderRadius:'4px', fontSize:'14px', resize:'vertical',
                 fontFamily:'inherit', boxSizing:'border-box', outline:'none' },
  select:      { width:'100%', padding:'10px 12px', border:'2px solid #dfe1e6',
                 borderRadius:'4px', fontSize:'14px', boxSizing:'border-box' },
  actions:     { display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'8px' },
  cancelBtn:   { padding:'8px 18px', background:'transparent', border:'none',
                 color:'#626f86', cursor:'pointer', fontSize:'14px' },
  saveBtn:     { padding:'8px 20px', background:'#0052CC', color:'#fff',
                 border:'none', borderRadius:'4px', cursor:'pointer',
                 fontSize:'14px', fontWeight:'600' }
};

export default EditTaskModal;