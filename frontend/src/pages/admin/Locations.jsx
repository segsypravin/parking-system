import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiPlus, FiEdit, FiTrash2, FiMap, FiMapPin } from 'react-icons/fi';

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editLoc, setEditLoc] = useState(null);
  const [form, setForm] = useState({ location_name: '', address: '', total_levels: 1 });
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.get('/locations');
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Load locations error:', err);
      setPageError('Failed to load parking locations. Please refresh.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
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
    } catch (err) {
      console.error('Location submit error:', err);
      setModalError(err.response?.data?.error || err.message || 'Failed to save location.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = (loc) => {
    setEditLoc(loc);
    setModalError('');
    setForm({ location_name: loc.location_name, address: loc.address, total_levels: loc.total_levels });
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditLoc(null);
    setModalError('');
    setForm({ location_name: '', address: '', total_levels: 1 });
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
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <FiPlus /> Add Location
        </button>
      </div>

      {pageError && (
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>
          {pageError}
        </div>
      )}

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
              {modalError && (
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', marginTop: '16px' }}>
                  {modalError}
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={modalLoading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Saving...' : (editLoc ? 'Update' : 'Add Location')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
