import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>TaskBoard</h1>
        <h2 style={styles.title}>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" value={name}
              onChange={(e) => setName(e.target.value)} placeholder="Vishal" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
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

export default RegisterPage;