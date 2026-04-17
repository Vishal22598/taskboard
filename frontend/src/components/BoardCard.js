import { useNavigate } from 'react-router-dom';

const BoardCard = ({ board, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation(); // prevent navigating when delete is clicked
    if (window.confirm('Delete this board and all its tasks?')) {
      onDelete(board._id);
    }
  };

  return (
    <div style={{ ...styles.card, background: board.background }}
         onClick={() => navigate(`/board/${board._id}`)}>
      <h3 style={styles.title}>{board.title}</h3>
      <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
    </div>
  );
};

const styles = {
  card:      { borderRadius:'8px', padding:'20px', cursor:'pointer', minHeight:'100px',
               display:'flex', flexDirection:'column', justifyContent:'space-between',
               transition:'transform 0.15s', boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
               position:'relative' },
  title:     { color:'#fff', fontSize:'18px', fontWeight:'700',
               textShadow:'0 1px 3px rgba(0,0,0,0.3)' },
  deleteBtn: { alignSelf:'flex-end', padding:'4px 10px', background:'rgba(0,0,0,0.25)',
               color:'#fff', border:'none', borderRadius:'4px',
               cursor:'pointer', fontSize:'12px' }
};

export default BoardCard;