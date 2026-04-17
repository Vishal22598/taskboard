import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {

  // Temporary BoardPage placeholder — replace on Day 6
const BoardPage = () => {
  const { id } = useParams();
  return <div style={{ padding: 40 }}>Board {id} — coming Day 6!</div>;
};
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          } />
          <Route path="/board/:id" element={
            <PrivateRoute><BoardPage /></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;