import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiCheck, FiX, FiCalendar } from 'react-icons/fi';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignSlotId, setAssignSlotId] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [bRes, sRes] = await Promise.all([API.get('/bookings'), API.get('/slots')]);
      setBookings(bRes.data);
      setSlots(sRes.data);
    } catch (err) { console.error(err); }
  };

  const availableSlots = slots.filter(s => s.slot_status === 'Available');

  const handleApprove = (booking) => {
    setSelectedBooking(booking);
    setAssignSlotId('');
    setShowAssignModal(true);
  };

  const confirmApprove = async () => {
    if (!assignSlotId) return alert('Please select a slot');
    try {
      await API.put(`/bookings/${selectedBooking.booking_id}/approve`, { slot_id: assignSlotId });
      setShowAssignModal(false);
      loadData();
    } catch (err) { alert(err.response?.data?.error || 'Approval failed'); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    await API.put(`/bookings/${id}/reject`, { reason });
    loadData();
  };

  const getStatusBadge = (status) => {
    const cls = status === 'Pending' ? 'badge-pending' : status === 'Approved' ? 'badge-approved' : 'badge-rejected';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Booking Requests</h1>
        <p>Manage user booking requests and assign slots</p>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Vehicle</th><th>Type</th><th>Status</th><th>Slot</th><th>Time</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.booking_id}>
                  <td style={{ fontWeight: 600 }}>#{b.booking_id}</td>
                  <td>
                    <div>{b.user_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.contact_no}</div>
                  </td>
                  <td>{b.vehicle_no || '—'}</td>
                  <td>{b.slot_type}</td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>{b.slot_id ? `S-${b.slot_id}` : '—'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(b.booking_time).toLocaleString()}
                  </td>
                  <td>
                    {b.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(b)}>
                          <FiCheck size={14} /> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.booking_id)}>
                          <FiX size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Slot Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Assign Slot to Booking #{selectedBooking.booking_id}</h2>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <p style={{ fontSize: '14px' }}><strong>User:</strong> {selectedBooking.user_name}</p>
              <p style={{ fontSize: '14px' }}><strong>Vehicle:</strong> {selectedBooking.vehicle_no} ({selectedBooking.vehicle_type})</p>
              <p style={{ fontSize: '14px' }}><strong>Requested Type:</strong> {selectedBooking.slot_type}</p>
            </div>
            <div className="input-group">
              <label>Select Available Slot</label>
              <select className="input-field" value={assignSlotId} onChange={e => setAssignSlotId(e.target.value)}>
                <option value="">Choose a slot...</option>
                {availableSlots
                  .filter(s => !selectedBooking.slot_type || s.slot_type === selectedBooking.slot_type)
                  .map(s => (
                    <option key={s.slot_id} value={s.slot_id}>
                      S-{s.slot_id} — {s.slot_type} — Level {s.slot_level} — {s.location_name || 'No Location'}
                    </option>
                  ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={confirmApprove}>Approve & Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
