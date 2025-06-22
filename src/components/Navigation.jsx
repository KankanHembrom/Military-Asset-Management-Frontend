
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav style={{ background: '#333', padding: '10px' }}>
      <Link to="/dashboard" style={{ color: 'white', marginRight: '10px' }}>Dashboard</Link>
      
      {(user.role === 'admin' || user.role === 'logistics_officer') && (
        <>
          <Link to="/purchase" style={{ color: 'white', marginRight: '10px' }}>Purchase</Link>
          <Link to="/transfer" style={{ color: 'white', marginRight: '10px' }}>Transfer</Link>
        </>
      )}

      {(user.role === 'admin' || user.role === 'base_commander') && (
        <>
          <Link to="/assign" style={{ color: 'white', marginRight: '10px' }}>Assign</Link>
          <Link to="/expend" style={{ color: 'white', marginRight: '10px' }}>Expend</Link>
        </>
      )}
    </nav>
  );
}
