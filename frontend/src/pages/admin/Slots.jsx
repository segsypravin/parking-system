import { useState, useEffect } from 'react';
import API from '../../api/axios';
import ParkingMap from '../../components/ParkingMap';
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSlot, setEditSlot] = useState(null);
  const [form, setForm] = useState({ slot_type: 'Car', slot_level: 1, slot_priority: 'Medium', slot_status: 'Available', location_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [slotsRes, locsRes] = await Promise.all([API.get('/slots'), API.get('/locations')]);
      setSlots(slotsRes.data);
      setLocations(locsRes.data);
    } catch (err) { console.error(err); }
  };

  const filteredSlots = filterLocation ? slots.filter(s => s.location_id == filterLocation) : slots;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSlot) {
        await API.put(`/slots/${editSlot.slot_id}`, form);
      } else {
        await API.post('/slots', form);
      }
      setShowModal(false);
      setEditSlot(null);
      setForm({ slot_type: 'Car', slot_level: 1, slot_priority: 'Medium', slot_status: 'Available', location_id: '' });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (slot) => {
    setEditSlot(slot);
    setForm({
      slot_type: slot.slot_type, slot_level: slot.slot_level,
      slot_priority: slot.slot_priority, slot_status: slot.slot_status,
      location_id: slot.location_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slot?')) return;
    await API.delete(`/slots/${id}`);
    loadData();
  };

  const handleStatusChange = async (slot) => {
    const newStatus = slot.slot_status === 'Available' ? 'Occupied' :
                      slot.slot_status === 'Occupied' ? 'Available' : slot.slot_status;
    await API.put(`/slots/${slot.slot_id}/status`, { slot_status: newStatus });
    loadData();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Parking Slots</h1>
          <p>Manage and monitor all parking slots</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="input-field" style={{ width: 'auto' }} value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.location_name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setEditSlot(null); setForm({ slot_type: 'Car', slot_level: 1, slot_priority: 'Medium', slot_status: 'Available', location_id: '' }); setShowModal(true); }}>
            <FiPlus /> Add Slot
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiMapPin style={{ color: 'var(--accent-blue-light)' }} /> Interactive Map
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>— Click a slot to toggle status</span>
        </h3>
        <ParkingMap slots={filteredSlots} interactive onSlotClick={handleStatusChange} />
      </div>

      {/* Table */}
      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Slot ID</th><th>Type</th><th>Level</th><th>Priority</th><th>Status</th><th>Location</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map(slot => (
                <tr key={slot.slot_id}>
                  <td style={{ fontWeight: 600 }}>S-{slot.slot_id}</td>
                  <td>{slot.slot_type === 'Bike' ? '🏍️' : '🚗'} {slot.slot_type}</td>
                  <td>Level {slot.slot_level}</td>
                  <td>{slot.slot_priority}</td>
                  <td><span className={`badge badge-${slot.slot_status?.toLowerCase()}`}>{slot.slot_status}</span></td>
                  <td>{slot.location_name || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(slot)}><FiEdit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(slot.slot_id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editSlot ? 'Edit Slot' : 'Add New Slot'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Type</label>
                    <select className="input-field" value={form.slot_type} onChange={e => setForm({...form, slot_type: e.target.value})}>
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Level</label>
                    <input type="number" className="input-field" value={form.slot_level} min="1"
                      onChange={e => setForm({...form, slot_level: e.target.value})} />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Priority</label>
                    <select className="input-field" value={form.slot_priority} onChange={e => setForm({...form, slot_priority: e.target.value})}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Status</label>
                    <select className="input-field" value={form.slot_status} onChange={e => setForm({...form, slot_status: e.target.value})}>
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <select className="input-field" value={form.location_id} onChange={e => setForm({...form, location_id: e.target.value})}>
                    <option value="">Select Location</option>
                    {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.location_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editSlot ? 'Update' : 'Add Slot'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
