import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiShield, FiMap, FiClock } from 'react-icons/fi';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Video */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0
        }}
      >
        <source src="/parking-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(10,14,39,0.75) 0%, rgba(10,14,39,0.9) 100%)',
        zIndex: 1
      }} />

      {/* Top Nav */}
      <nav style={{
        position: 'relative', zIndex: 10, padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{
          fontSize: '22px', fontWeight: 800,
          background: 'linear-gradient(135deg, #4f46e5, #10b981)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          🅿️ SmartPark
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user ? (
            <Link to={user.user_type === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} className="btn btn-primary">
              Go to Dashboard <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started <FiArrowRight /></Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)', textAlign: 'center', padding: '0 20px'
      }}>
        <div className="animate-fade-in" style={{ marginBottom: '16px' }}>
          <span className="badge badge-active" style={{ fontSize: '13px', padding: '6px 16px' }}>
            ✨ Smart Parking Management
          </span>
        </div>

        <h1 className="animate-fade-in animate-fade-in-delay-1" style={{
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
          lineHeight: 1.1, maxWidth: '800px', marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #a0a8c8 50%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Parking Made Effortless & Smart
        </h1>

        <p className="animate-fade-in animate-fade-in-delay-2" style={{
          fontSize: '18px', color: 'var(--text-secondary)',
          maxWidth: '560px', lineHeight: 1.6, marginBottom: '40px'
        }}>
          Real-time slot tracking, instant bookings, and intelligent management — all in one platform designed for modern parking.
        </p>

        <div className="animate-fade-in animate-fade-in-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '16px' }}>
            Start Free <FiArrowRight />
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg" style={{ fontSize: '16px' }}>
            Admin Login
          </Link>
        </div>

        {/* Feature cards */}
        <div className="animate-fade-in animate-fade-in-delay-4" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px', maxWidth: '800px', width: '100%', marginTop: '80px'
        }}>
          {[
            { icon: FiMap, title: 'Live Slot Map', desc: 'Real-time visual parking grid' },
            { icon: FiClock, title: 'Instant Booking', desc: 'Book & get approval in minutes' },
            { icon: FiShield, title: 'Admin Control', desc: 'Full management of vehicles & slots' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{
              padding: '24px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)'
            }}>
              <Icon size={28} style={{ color: 'var(--accent-blue-light)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
