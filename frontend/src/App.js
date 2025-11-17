import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import UserCreation from './components/UserCreation';
import ChangePassword from './components/ChangePassword';
import StoreCreation from './components/StoreCreation';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setUser({ role }); 
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ role });
  };

  const handleSignup = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <Signup onSignup={handleSignup} /> : <Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
              />
              <Route
                path="/create-user"
                element={user && user.role === 'admin' ? <UserCreation user={user} /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/create-store"
                element={user && user.role === 'admin' ? <StoreCreation /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/change-password"
                element={user ? <ChangePassword /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
