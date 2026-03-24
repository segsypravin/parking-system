import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import ParkingMap from '../../components/ParkingMap';
import { FiMapPin, FiActivity, FiCalendar, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, occupied: 0, available: 0, reserved: 0 });
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, slotsRes, bookingsRes] = await Promise.all([
        API.get('/slots/stats'),
        API.get('/slots'),
        API.get('/bookings/my')
      ]);
      setStats(statsRes.data);
      setSlots(slotsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>View parking availability and manage your bookings</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={FiMapPin} label="Total Slots" value={stats.total} color="#4f46e5" delay={1} />
        <StatsCard icon={FiActivity} label="Available" value={stats.available} color="#10b981" delay={2} />
        <StatsCard icon={FiMapPin} label="Occupied" value={stats.occupied} color="#ef4444" delay={3} />
        <StatsCard icon={FiCalendar} label="My Bookings" value={bookings.length} color="#f59e0b" delay={4} />
      </div>

      {/* Parking Map */}
      <div className="glass-card animate-fade-in" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiMapPin style={{ color: 'var(--accent-blue-light)' }} /> Parking Availability Map
        </h3>
        <ParkingMap slots={slots} />
      </div>

      {/* My Recent Bookings */}
      <div className="glass-card animate-fade-in">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiCalendar style={{ color: 'var(--accent-amber)' }} /> Recent Bookings
        </h3>
        {bookings.length === 0 ? (
          <div className="empty-state"><p>No bookings yet. Book a slot to get started!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookings.slice(0, 5).map(b => (
              <div key={b.booking_id} style={{
                padding: '14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    Booking #{b.booking_id} — {b.slot_type}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {b.vehicle_no} • {new Date(b.booking_time).toLocaleDateString()}
                    {b.slot_id && ` • Slot S-${b.slot_id}`}
                  </div>
                </div>
                <span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
