import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 14, 39, 0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 30px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{
        fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px',
        background: 'linear-gradient(135deg, #4f46e5, #10b981)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>
        🅿️ SmartPark
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {user.name} <span className="badge badge-active" style={{ marginLeft: '6px' }}>{user.user_type}</span>
          </span>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
            <FiLogOut /> Logout
          </button>
        </div>
      )}

      {!user && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </div>
      )}
    </nav>
  );
}
