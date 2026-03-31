import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiPlus, FiEdit, FiTrash2, FiTruck } from 'react-icons/fi';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N', user_id: '' });
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [vRes, uRes] = await Promise.all([API.get('/vehicles'), API.get('/users')]);
      setVehicles(Array.isArray(vRes.data) ? vRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
    } catch (err) {
      console.error('Load data error:', err);
      setPageError('Failed to load vehicles or users. Please refresh the page.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
    try {
      // Ensure user_id is provided
      if (!form.user_id) {
        throw new Error('Please select an owner for the vehicle.');
      }

      if (editVehicle) {
        await API.put(`/vehicles/${editVehicle.vehicle_id}`, form);
      } else {
        await API.post('/vehicles', form);
      }
      setShowModal(false);
      setEditVehicle(null);
      setForm({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N', user_id: '' });
      loadData();
    } catch (err) {
      console.error('Vehicle submit error:', err);
      setModalError(err.response?.data?.error || err.message || 'Failed to save vehicle.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = (v) => {
    setEditVehicle(v);
    setModalError('');
    setForm({ vehicle_no: v.vehicle_no, vehicle_type: v.vehicle_type, frequent_visitor: v.frequent_visitor || 'N', user_id: v.user_id || '' });
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setEditVehicle(null);
    setModalError('');
    setForm({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N', user_id: '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    await API.delete(`/vehicles/${id}`);
    loadData();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Vehicles</h1><p>Manage all registered vehicles</p></div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <FiPlus /> Add Vehicle
        </button>
      </div>

      {pageError && (
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>
          {pageError}
        </div>
      )}

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Vehicle No.</th><th>Type</th><th>Owner</th><th>Contact</th><th>Frequent</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.vehicle_id}>
                  <td style={{ fontWeight: 600 }}>{v.vehicle_id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{v.vehicle_type === 'Bike' ? '🏍️' : '🚗'}</span>
                      <span style={{ fontWeight: 600 }}>{v.vehicle_no}</span>
                    </div>
                  </td>
                  <td>{v.vehicle_type}</td>
                  <td>{v.owner_name || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{v.owner_contact || '—'}</td>
                  <td>
                    <span className={`badge ${v.frequent_visitor === 'Y' ? 'badge-approved' : 'badge-completed'}`}>
                      {v.frequent_visitor === 'Y' ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(v)}><FiEdit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.vehicle_id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Vehicle Number</label>
                  <input className="input-field" value={form.vehicle_no} placeholder="MH12AB1234"
                    onChange={e => setForm({...form, vehicle_no: e.target.value})} required />
                </div>
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Type</label>
                    <select className="input-field" value={form.vehicle_type} onChange={e => setForm({...form, vehicle_type: e.target.value})}>
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Frequent Visitor</label>
                    <select className="input-field" value={form.frequent_visitor} onChange={e => setForm({...form, frequent_visitor: e.target.value})}>
                      <option value="N">No</option>
                      <option value="Y">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Owner</label>
                  <select className="input-field" value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})}>
                    <option value="">Select Owner</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name} ({u.email})</option>)}
                  </select>
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
                  {modalLoading ? 'Saving...' : (editVehicle ? 'Update' : 'Add Vehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
