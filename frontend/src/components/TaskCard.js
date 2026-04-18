import { useState } from 'react';
import { updateTask, deleteTask } from '../api/taskApi';
import EditTaskModal from './EditTaskModal';
import toast from 'react-hot-toast';

const PRIORITY_COLORS = {
  high:   { bg: '#FFEBE6', text: '#BF2600' },
  medium: { bg: '#FFFAE6', text: '#FF8B00' },
  low:    { bg: '#E3FCEF', text: '#006644' },
};

const TaskCard = ({ task, columns, onTaskUpdate, onTaskDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [moving, setMoving]               = useState(false);

  const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  // ── Find which column this task is currently in ──────────────────────────
  const currentColumn = columns.find(c => c._id === task.columnId);

  // ── Find the next column based on fixed order ────────────────────────────
  const getNextColumn = () => {
    const ORDER = ['To Do', 'In Progress', 'Done'];
    const currentIndex = ORDER.indexOf(currentColumn?.title);
    if (currentIndex === -1 || currentIndex >= ORDER.length - 1) return null;
    return columns.find(c => c.title === ORDER[currentIndex + 1]) || null;
  };

  const nextColumn = getNextColumn();

  // ── Move task to next column ─────────────────────────────────────────────
  const handleMoveTask = async () => {
    if (!nextColumn || moving) return;
    setMoving(true);
    try {
      const { data } = await updateTask(task._id, {
        title:       task.title,
        description: task.description,
        priority:    task.priority,
        dueDate:     task.dueDate,
        columnId:    nextColumn._id,   // ← key change — new column
        boardId:     task.boardId,
        order:       task.order
      });
      onTaskUpdate(task._id, data);    // update parent state with response
      toast.success(`Moved to ${nextColumn.title}`);
    } catch (err) {
      toast.error('Failed to move task');
    } finally {
      setMoving(false);
    }
  };

  // ── Delete task ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(task._id);
      onTaskDelete(task._id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <div style={styles.card}>

        {/* Top row — priority badge + edit + delete */}
        <div style={styles.topRow}>
          <span style={{ ...styles.badge, background: p.bg, color: p.text }}>
            {task.priority}
          </span>
          <div style={styles.btnGroup}>
            <button
              onClick={() => setShowEditModal(true)}
              style={styles.editBtn}
              title="Edit task"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={styles.deleteBtn}
              title="Delete task"
            >
              x
            </button>
          </div>
        </div>

        {/* Task title */}
        <p style={styles.title}>{task.title}</p>

        {/* Description — only if exists */}
        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {/* Due date — only if exists */}
        {task.dueDate && (
          <p style={styles.dueDate}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        {/* Footer — move button or complete badge */}
        <div style={styles.footer}>
          {currentColumn?.title === 'Done' ? (

            // Task is in Done — show complete badge
            <span style={styles.completeBadge}>✓ Complete</span>

          ) : nextColumn ? (

            // Task has a next column — show move button
            <button
              onClick={handleMoveTask}
              style={styles.moveBtn}
              disabled={moving}
            >
              {moving ? 'Moving...' : `→ ${nextColumn.title}`}
            </button>

          ) : null}
        </div>

      </div>

      {/* Edit modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onTaskUpdate={(taskId, updatedTask) => {
            onTaskUpdate(taskId, updatedTask);
          }}
        />
      )}
    </>
  );
};

const styles = {
  card:          { background:'#fff', borderRadius:'6px', padding:'12px',
                   marginBottom:'8px', boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
                   border:'1px solid #dfe1e6' },
  topRow:        { display:'flex', justifyContent:'space-between',
                   alignItems:'center', marginBottom:'8px' },
  badge:         { fontSize:'11px', fontWeight:'700', padding:'2px 8px',
                   borderRadius:'3px', textTransform:'uppercase' },
  btnGroup:      { display:'flex', gap:'4px', alignItems:'center' },
  editBtn:       { background:'#F4F5F7', border:'1px solid #dfe1e6',
                   borderRadius:'3px', padding:'3px 8px', fontSize:'12px',
                   cursor:'pointer', color:'#172b4d', fontWeight:'500' },
  deleteBtn:     { background:'none', border:'none', color:'#97a0af',
                   cursor:'pointer', fontSize:'16px', lineHeight:1, padding:'0 2px' },
  title:         { fontSize:'14px', fontWeight:'600', color:'#172b4d',
                   margin:'0 0 4px 0', lineHeight:'1.4' },
  description:   { fontSize:'12px', color:'#626f86', margin:'4px 0',
                   lineHeight:'1.4' },
  dueDate:       { fontSize:'11px', color:'#9caab8', margin:'4px 0 8px' },
  footer:        { display:'flex', justifyContent:'flex-end', marginTop:'8px' },
  moveBtn:       { padding:'5px 12px', background:'#0052CC', color:'#fff',
                   border:'none', borderRadius:'4px', fontSize:'12px',
                   fontWeight:'600', cursor:'pointer' },
  completeBadge: { fontSize:'12px', color:'#00875A', fontWeight:'700',
                   background:'#E3FCEF', padding:'3px 8px', borderRadius:'3px' }
};

export default TaskCard;