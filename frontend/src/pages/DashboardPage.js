import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#172b4d' }}>Welcome, {user?.name}!</h1>
        <button
          onClick={logout}
          style={{ padding: '8px 16px', background: '#de350b', color: '#fff',
                   border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      <p style={{ color: '#5e6c84', marginTop: '8px' }}>
        Your boards will appear here — coming on Day 5!
      </p>
    </div>
  );
};

export default DashboardPage;