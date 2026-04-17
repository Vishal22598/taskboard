const PRIORITY_COLORS = {
  high:   { bg: '#FFEBE6', text: '#BF2600' },
  medium: { bg: '#FFFAE6', text: '#FF8B00' },
  low:    { bg: '#E3FCEF', text: '#006644' },
};

const TaskCard = ({ task, onDelete }) => {
  const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <span style={{ ...styles.badge, background: p.bg, color: p.text }}>
          {task.priority}
        </span>
        <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>x</button>
      </div>
      <p style={styles.title}>{task.title}</p>
      {task.dueDate && (
        <p style={styles.due}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const styles = {
  card:      { background:'#fff', borderRadius:'6px', padding:'12px',
               marginBottom:'8px', boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
               cursor:'default' },
  topRow:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' },
  badge:     { fontSize:'11px', fontWeight:'700', padding:'2px 8px',
               borderRadius:'3px', textTransform:'uppercase' },
  deleteBtn: { background:'none', border:'none', color:'#97a0af',
               cursor:'pointer', fontSize:'16px', lineHeight:1, padding:'0 2px' },
  title:     { fontSize:'14px', color:'#172b4d', lineHeight:'1.4' },
  due:       { fontSize:'12px', color:'#97a0af', marginTop:'6px' }
};
export default TaskCard;
