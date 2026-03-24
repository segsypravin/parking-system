import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiPlus, FiEdit, FiTrash2, FiMap, FiMapPin } from 'react-icons/fi';

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editLoc, setEditLoc] = useState(null);
  const [form, setForm] = useState({ location_name: '', address: '', total_levels: 1 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.get('/locations');
      setLocations(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLoc) {
        await API.put(`/locations/${editLoc.location_id}`, form);
      } else {
        await API.post('/locations', form);
      }
      setShowModal(false);
      setEditLoc(null);
      setForm({ location_name: '', address: '', total_levels: 1 });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (loc) => {
    setEditLoc(loc);
    setForm({ location_name: loc.location_name, address: loc.address, total_levels: loc.total_levels });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this location? All associated slots will lose their location.')) return;
    await API.delete(`/locations/${id}`);
    loadData();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Parking Locations</h1><p>Manage parking areas and maps</p></div>
        <button className="btn btn-primary" onClick={() => { setEditLoc(null); setForm({ location_name: '', address: '', total_levels: 1 }); setShowModal(true); }}>
          <FiPlus /> Add Location
        </button>
      </div>

      <div className="content-grid">
        {locations.map(loc => (
          <div key={loc.location_id} className="glass-card animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(79, 70, 229, 0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <FiMap size={22} style={{ color: 'var(--accent-blue-light)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{loc.location_name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{loc.address}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(loc)}><FiEdit size={14} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(loc.location_id)}><FiTrash2 size={14} /></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-blue-light)' }}>{loc.total_slots || 0}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Slots</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-emerald)' }}>{loc.available_slots || 0}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{loc.total_levels}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Levels</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editLoc ? 'Edit Location' : 'Add New Location'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Location Name</label>
                  <input className="input-field" value={form.location_name} placeholder="Main Campus Parking"
                    onChange={e => setForm({...form, location_name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Address</label>
                  <input className="input-field" value={form.address} placeholder="123 University Road"
                    onChange={e => setForm({...form, address: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Total Levels</label>
                  <input type="number" className="input-field" value={form.total_levels} min="1"
                    onChange={e => setForm({...form, total_levels: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editLoc ? 'Update' : 'Add Location'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
