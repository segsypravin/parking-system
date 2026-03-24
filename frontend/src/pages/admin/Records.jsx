import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiLogIn, FiLogOut, FiClipboard } from 'react-icons/fi';

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryForm, setEntryForm] = useState({ vehicle_id: '', slot_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [rRes, vRes, sRes] = await Promise.all([API.get('/records'), API.get('/vehicles'), API.get('/slots')]);
      setRecords(rRes.data);
      setVehicles(vRes.data);
      setSlots(sRes.data);
    } catch (err) { console.error(err); }
  };

  const handleEntry = async (e) => {
    e.preventDefault();
    try {
      await API.post('/records/entry', entryForm);
      setShowEntryModal(false);
      setEntryForm({ vehicle_id: '', slot_id: '' });
      loadData();
    } catch (err) { alert(err.response?.data?.error || 'Entry failed'); }
  };

  const handleExit = async (recordId) => {
    if (!confirm('Record exit for this vehicle?')) return;
    try {
      const res = await API.put(`/records/${recordId}/exit`);
      alert(`Exit recorded. Duration: ${res.data.duration}h, Charges: ₹${res.data.charges}`);
      loadData();
    } catch (err) { alert(err.response?.data?.error || 'Exit failed'); }
  };

  const availableSlots = slots.filter(s => s.slot_status === 'Available');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Parking Records</h1><p>Vehicle entry/exit tracking and billing</p></div>
        <button className="btn btn-primary" onClick={() => setShowEntryModal(true)}>
          <FiLogIn /> Record Entry
        </button>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Record</th><th>Vehicle</th><th>Slot</th><th>Entry</th><th>Exit</th><th>Duration</th><th>Status</th><th>Charges</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.record_id}>
                  <td style={{ fontWeight: 600 }}>#{r.record_id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{r.vehicle_type === 'Bike' ? '🏍️' : '🚗'}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.vehicle_no}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.owner_name}</div>
                      </div>
                    </div>
                  </td>
                  <td>S-{r.slot_id}</td>
                  <td style={{ fontSize: '12px' }}>{new Date(r.entry_time).toLocaleString()}</td>
                  <td style={{ fontSize: '12px' }}>{r.exit_time ? new Date(r.exit_time).toLocaleString() : '—'}</td>
                  <td>{r.parking_duration ? `${r.parking_duration}h` : '—'}</td>
                  <td>
                    <span className={`badge badge-${r.rotation_status?.toLowerCase()}`}>
                      {r.rotation_status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.charges ? `₹${r.charges}` : '—'}</td>
                  <td>
                    {r.rotation_status === 'Active' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleExit(r.record_id)}>
                        <FiLogOut size={14} /> Exit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEntryModal && (
        <div className="modal-overlay" onClick={() => setShowEntryModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Record Vehicle Entry</h2>
            <form onSubmit={handleEntry}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Vehicle</label>
                  <select className="input-field" value={entryForm.vehicle_id} onChange={e => setEntryForm({...entryForm, vehicle_id: e.target.value})} required>
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_no} — {v.vehicle_type} ({v.owner_name})</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Slot</label>
                  <select className="input-field" value={entryForm.slot_id} onChange={e => setEntryForm({...entryForm, slot_id: e.target.value})} required>
                    <option value="">Select Slot</option>
                    {availableSlots.map(s => <option key={s.slot_id} value={s.slot_id}>S-{s.slot_id} — {s.slot_type} — Level {s.slot_level}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowEntryModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Record Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
