import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiCalendar } from 'react-icons/fi';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.get('/bookings/my');
      setBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const getStatusBadge = (status) => {
    const cls = status === 'Pending' ? 'badge-pending' : status === 'Approved' ? 'badge-approved' : 'badge-rejected';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track the status of your parking reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <FiCalendar size={48} />
            <h3>No Bookings Yet</h3>
            <p>Book a parking slot to see your reservations here</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div key={b.booking_id} className="glass-card animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700 }}>Booking #{b.booking_id}</span>
                    {getStatusBadge(b.status)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', fontSize: '14px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Vehicle:</span> {b.vehicle_no || '—'}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> {b.slot_type}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Slot:</span> {b.slot_id ? `S-${b.slot_id} (Level ${b.slot_level})` : 'Pending Assignment'}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Booked:</span> {new Date(b.booking_time).toLocaleString()}</div>
                  </div>
                  {b.status === 'Rejected' && b.rejection_reason && (
                    <div style={{
                      marginTop: '12px', padding: '10px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#f87171', fontSize: '13px'
                    }}>
                      <strong>Rejection Reason:</strong> {b.rejection_reason}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '32px', opacity: 0.3
                }}>
                  {b.slot_type === 'Bike' ? '🏍️' : '🚗'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
