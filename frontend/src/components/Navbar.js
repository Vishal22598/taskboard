import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>TaskBoard</div>
      <div style={styles.right}>
        <span style={styles.username}>{user?.name}</span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav:       { display:'flex', alignItems:'center', justifyContent:'space-between',
               padding:'0 24px', height:'56px', background:'#0052CC',
               color:'#fff', position:'sticky', top:0, zIndex:100 },
  logo:      { fontSize:'20px', fontWeight:'700', letterSpacing:'0.5px' },
  right:     { display:'flex', alignItems:'center', gap:'16px' },
  username:  { fontSize:'14px', opacity:0.9 },
  logoutBtn: { padding:'6px 14px', background:'rgba(255,255,255,0.15)',
               color:'#fff', border:'1px solid rgba(255,255,255,0.3)',
               borderRadius:'4px', cursor:'pointer', fontSize:'13px' }
};

export default Navbar;