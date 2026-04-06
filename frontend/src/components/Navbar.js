import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  };

  const navLinksStyle = {
    display: 'flex',
    listStyle: 'none',
    gap: '2rem',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const logoutBtnStyle = {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  if (!user) {
    return (
      <nav style={navStyle}>
        <div style={navContainerStyle}>
          <Link to="/" style={logoStyle}>Alumni Platform</Link>
          <div>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <Link to="/" style={logoStyle}>Alumni Platform</Link>
        
        <ul style={navLinksStyle}>
          <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
          <li><Link to="/directory" style={linkStyle}>Directory</Link></li>
          <li><Link to="/events" style={linkStyle}>Events</Link></li>
          <li><Link to="/news" style={linkStyle}>News</Link></li>
          <li><Link to="/jobs" style={linkStyle}>Jobs</Link></li>
          <li><Link to="/suggestions" style={linkStyle}>Suggestions</Link></li>
          {user.role === 'admin' && (
            <li><Link to="/admin" style={linkStyle}>Admin</Link></li>
          )}
        </ul>

        <div style={userInfoStyle}>
          <Link to="/profile" style={linkStyle}>
            {user.name}
          </Link>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
