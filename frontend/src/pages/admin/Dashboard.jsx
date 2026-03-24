import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import ParkingMap from '../../components/ParkingMap';
import { FiMapPin, FiTruck, FiUsers, FiCalendar, FiActivity, FiClock } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, occupied: 0, available: 0, reserved: 0 });
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, slotsRes, bookingsRes, recordsRes] = await Promise.all([
        API.get('/slots/stats'),
        API.get('/slots'),
        API.get('/bookings'),
        API.get('/records')
      ]);
      setStats(statsRes.data);
      setSlots(slotsRes.data);
      setBookings(bookingsRes.data);
      setRecords(recordsRes.data);
    } catch (err) {
      console.error('Load dashboard data error:', err);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const activeRecords = records.filter(r => r.rotation_status === 'Active');

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your parking system</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon={FiMapPin} label="Total Slots" value={stats.total} color="#4f46e5" delay={1} />
        <StatsCard icon={FiActivity} label="Occupied" value={stats.occupied} color="#ef4444" delay={2} />
        <StatsCard icon={FiMapPin} label="Available" value={stats.available} color="#10b981" delay={3} />
        <StatsCard icon={FiCalendar} label="Pending Bookings" value={pendingBookings.length} color="#f59e0b" delay={4} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Parking Map */}
        <div className="glass-card animate-fade-in" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiMapPin style={{ color: 'var(--accent-blue-light)' }} /> Live Parking Map
          </h3>
          <ParkingMap slots={slots} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pending Bookings */}
        <div className="glass-card animate-fade-in">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCalendar style={{ color: 'var(--accent-amber)' }} /> Pending Bookings
            {pendingBookings.length > 0 && (
              <span className="badge badge-pending">{pendingBookings.length}</span>
            )}
          </h3>
          {pendingBookings.length === 0 ? (
            <div className="empty-state"><p>No pending bookings</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingBookings.slice(0, 5).map(b => (
                <div key={b.booking_id} style={{
                  padding: '12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.user_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {b.vehicle_no} • {b.slot_type}
                    </div>
                  </div>
                  <span className="badge badge-pending">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Vehicles */}
        <div className="glass-card animate-fade-in">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiClock style={{ color: 'var(--accent-emerald)' }} /> Active Vehicles
            <span className="badge badge-active">{activeRecords.length}</span>
          </h3>
          {activeRecords.length === 0 ? (
            <div className="empty-state"><p>No active vehicles</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeRecords.slice(0, 5).map(r => (
                <div key={r.record_id} style={{
                  padding: '12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.vehicle_no}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Slot S-{r.slot_id} • Since {new Date(r.entry_time).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge badge-active">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
