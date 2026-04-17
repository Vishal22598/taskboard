import { useState, useEffect } from 'react';
import { getBoards, createBoard, deleteBoard } from '../api/boardApi';
import Navbar from '../components/Navbar';
import BoardCard from '../components/BoardCard';
import CreateBoardModal from '../components/CreateBoardModal';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [boards, setBoards]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch all boards on mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await getBoards();
      setBoards(data);
    } catch (err) {
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (boardData) => {
    try {
      const { data } = await createBoard(boardData);
      setBoards((prev) => [...prev, data]); // optimistic update
      toast.success('Board created!');
    } catch (err) {
      toast.error('Failed to create board');
    }
  };

  const handleDelete = async (boardId) => {
    try {
      await deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
      toast.success('Board deleted');
    } catch (err) {
      toast.error('Failed to delete board');
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Your Boards</h2>
          <button onClick={() => setShowModal(true)} style={styles.newBtn}>
            + New Board
          </button>
        </div>

        {loading ? (
          <p style={styles.message}>Loading boards...</p>
        ) : boards.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No boards yet.</p>
            <button onClick={() => setShowModal(true)} style={styles.newBtn}>
              Create your first board
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {boards.map((board) => (
              <BoardCard key={board._id} board={board} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

const styles = {
  page:      { minHeight:'100vh', background:'#f4f5f7' },
  content:   { maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' },
  header:    { display:'flex', justifyContent:'space-between',
               alignItems:'center', marginBottom:'24px' },
  heading:   { fontSize:'22px', fontWeight:'700', color:'#172b4d' },
  newBtn:    { padding:'10px 18px', background:'#0052CC', color:'#fff',
               border:'none', borderRadius:'4px', cursor:'pointer',
               fontSize:'14px', fontWeight:'600' },
  grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))',
               gap:'20px' },
  message:   { color:'#5e6c84', textAlign:'center', marginTop:'60px' },
  emptyState:{ textAlign:'center', marginTop:'80px' },
  emptyText: { fontSize:'18px', color:'#5e6c84', marginBottom:'16px' }
};

export default DashboardPage;