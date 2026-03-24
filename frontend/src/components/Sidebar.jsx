import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiMapPin, FiTruck, FiUsers, FiCalendar,
  FiClipboard, FiMap, FiBookOpen, FiNavigation, FiBox
} from 'react-icons/fi';

const adminLinks = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/slots', icon: FiMapPin, label: 'Parking Slots' },
  { to: '/admin/vehicles', icon: FiTruck, label: 'Vehicles' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/bookings', icon: FiCalendar, label: 'Bookings' },
  { to: '/admin/records', icon: FiClipboard, label: 'Records' },
  { to: '/admin/locations', icon: FiMap, label: 'Locations' },
];

const userLinks = [
  { to: '/user/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/user/book', icon: FiBookOpen, label: 'Book Slot' },
  { to: '/user/bookings', icon: FiCalendar, label: 'My Bookings' },
  { to: '/user/vehicles', icon: FiTruck, label: 'My Vehicles' },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : userLinks;
  const location = useLocation();

  return (
    <aside style={{
      position: 'fixed', top: '64px', left: 0, bottom: 0, width: '260px',
      background: 'rgba(10, 14, 39, 0.95)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '24px 16px', overflowY: 'auto', zIndex: 90,
      display: 'flex', flexDirection: 'column', gap: '4px'
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '1px',
        padding: '8px 12px', marginBottom: '8px'
      }}>
        {isAdmin ? 'Admin Panel' : 'User Panel'}
      </div>

      {links.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink key={to} to={to} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: '14px', fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
            transition: 'var(--transition)',
            textDecoration: 'none',
          }}>
            <Icon size={18} style={{ color: isActive ? 'var(--accent-blue-light)' : 'var(--text-muted)' }} />
            {label}
          </NavLink>
        );
      })}
    </aside>
  );
}
