import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>TaskBoard</h1>
        <h2 style={styles.title}>Log in to your account</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0052CC' },
  card:      { background: '#fff', borderRadius: '8px', padding: '40px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  logo:      { textAlign: 'center', color: '#0052CC', fontSize: '28px', marginBottom: '8px' },
  title:     { textAlign: 'center', fontSize: '18px', color: '#172b4d', marginBottom: '24px' },
  field:     { marginBottom: '16px' },
  label:     { display: 'block', fontSize: '14px', fontWeight: '600', color: '#172b4d', marginBottom: '4px' },
  input:     { width: '100%', padding: '10px 12px', border: '2px solid #dfe1e6', borderRadius: '4px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  button:    { width: '100%', padding: '12px', background: '#0052CC', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  footer:    { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#5e6c84' },
  link:      { color: '#0052CC', textDecoration: 'none', fontWeight: '600' }
};

export default LoginPage;