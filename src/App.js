
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchase from './pages/Purchase';
import Transfer from './pages/Transfer';
import Assign from './pages/Assign';
import Expend from './pages/Expend';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

function Navigation() {
  const { user, logout, loading } = useAuth();
  if (loading || !user) return null;

  return (
    <nav style={{ backgroundColor: '#1f2937', padding: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      {(user.role === 'admin' || user.role === 'logistics_officer') && (
        <>
          <Link to="/purchase" style={{ color: 'white', textDecoration: 'none' }}>Purchase</Link>
          <Link to="/transfer" style={{ color: 'white', textDecoration: 'none' }}>Transfer</Link>
        </>
      )}
      {(user.role === 'admin' || user.role === 'base_commander') && (
        <>
          <Link to="/assign" style={{ color: 'white', textDecoration: 'none' }}>Assign</Link>
          <Link to="/expend" style={{ color: 'white', textDecoration: 'none' }}>Expend</Link>
        </>
      )}
      <button onClick={logout} style={{ marginLeft: 'auto', color: 'white', background: 'transparent', border: '1px solid white', padding: '5px 10px', borderRadius: '5px' }}>
        Logout
      </button>
    </nav>
  );
}

function AppLayout() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/purchase" element={<PrivateRoute roles={["admin", "logistics_officer"]}><Purchase /></PrivateRoute>} />
        <Route path="/transfer" element={<PrivateRoute roles={["admin", "logistics_officer"]}><Transfer /></PrivateRoute>} />
        <Route path="/assign" element={<PrivateRoute roles={["admin", "base_commander"]}><Assign /></PrivateRoute>} />
        <Route path="/expend" element={<PrivateRoute roles={["admin", "base_commander"]}><Expend /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
  <Route path="/" element={<Navigate to="/login" />} /> {/* ✅ redirect root to /login */}
  <Route path="/login" element={<Login />} />
  <Route path="/*" element={<AppLayout />} />
</Routes>

      </Router>
    </AuthProvider>
  );
}
