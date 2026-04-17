import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );
  const navigate = useNavigate();

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    navigate('/dashboard');
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in every component instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);