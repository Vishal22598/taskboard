import { useState } from 'react';

const COLORS = [
  '#0052CC','#0079BF','#00875A','#6554C0',
  '#FF5630','#FF8B00','#00B8D9','#253858'
];

const CreateBoardModal = ({ onClose, onCreate }) => {
  const [title, setTitle]   = useState('');
  const [color, setColor]   = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onCreate({ title: title.trim(), background: color });
    setLoading(false);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.heading}>Create Board</h2>

        {/* Preview */}
        <div style={{ ...styles.preview, background: color }}>
          <span style={styles.previewText}>{title || 'Board name'}</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Color picker */}
          <p style={styles.label}>Background color</p>
          <div style={styles.colorGrid}>
            {COLORS.map((c) => (
              <div key={c}
                onClick={() => setColor(c)}
                style={{
                  ...styles.colorSwatch,
                  background: c,
                  outline: color === c ? '3px solid #172b4d' : 'none'
                }}
              />
            ))}
          </div>

          {/* Title input */}
          <p style={styles.label}>Board title</p>
          <input
            style={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Project"
            autoFocus
            required
          />

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.createBtn} disabled={loading || !title.trim()}>
              {loading ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay:     { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
                 display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  modal:       { background:'#fff', borderRadius:'8px', padding:'28px',
                 width:'360px', boxShadow:'0 8px 32px rgba(0,0,0,0.25)' },
  heading:     { fontSize:'18px', fontWeight:'700', color:'#172b4d', marginBottom:'16px' },
  preview:     { borderRadius:'6px', height:'80px', marginBottom:'16px',
                 display:'flex', alignItems:'center', justifyContent:'center' },
  previewText: { color:'#fff', fontWeight:'700', fontSize:'16px',
                 textShadow:'0 1px 3px rgba(0,0,0,0.4)' },
  label:       { fontSize:'12px', fontWeight:'700', color:'#5e6c84',
                 marginBottom:'8px', textTransform:'uppercase' },
  colorGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)',
                 gap:'8px', marginBottom:'16px' },
  colorSwatch: { height:'36px', borderRadius:'4px', cursor:'pointer' },
  input:       { width:'100%', padding:'10px 12px', border:'2px solid #dfe1e6',
                 borderRadius:'4px', fontSize:'14px', marginBottom:'16px',
                 boxSizing:'border-box' },
  actions:     { display:'flex', gap:'8px', justifyContent:'flex-end' },
  cancelBtn:   { padding:'8px 16px', background:'transparent', border:'none',
                 color:'#5e6c84', cursor:'pointer', fontSize:'14px' },
  createBtn:   { padding:'8px 16px', background:'#0052CC', color:'#fff',
                 border:'none', borderRadius:'4px', cursor:'pointer',
                 fontSize:'14px', fontWeight:'600' }
};

export default CreateBoardModal;