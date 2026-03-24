import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiPlus, FiEdit, FiTrash2, FiTruck } from 'react-icons/fi';

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.get('/vehicles/my');
      setVehicles(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editVehicle) {
        await API.put(`/vehicles/${editVehicle.vehicle_id}`, form);
      } else {
        await API.post('/vehicles', form);
      }
      setShowModal(false);
      setEditVehicle(null);
      setForm({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N' });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (v) => {
    setEditVehicle(v);
    setForm({ vehicle_no: v.vehicle_no, vehicle_type: v.vehicle_type, frequent_visitor: v.frequent_visitor });
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>My Vehicles</h1><p>Manage your registered vehicles</p></div>
        <button className="btn btn-primary" onClick={() => { setEditVehicle(null); setForm({ vehicle_no: '', vehicle_type: 'Car', frequent_visitor: 'N' }); setShowModal(true); }}>
          <FiPlus /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <FiTruck size={48} />
            <h3>No Vehicles</h3>
            <p>Add your vehicle to start booking parking slots</p>
          </div>
        </div>
      ) : (
        <div className="content-grid">
          {vehicles.map(v => (
            <div key={v.vehicle_id} className="glass-card animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(79, 70, 229, 0.15)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '28px'
                  }}>
                    {v.vehicle_type === 'Bike' ? '🏍️' : '🚗'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{v.vehicle_no}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{v.vehicle_type}</p>
                    <span className={`badge ${v.frequent_visitor === 'Y' ? 'badge-approved' : 'badge-completed'}`} style={{ marginTop: '4px' }}>
                      {v.frequent_visitor === 'Y' ? 'Frequent' : 'Regular'}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(v)}><FiEdit size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
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
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editVehicle ? 'Update' : 'Add Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
