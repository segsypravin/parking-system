import { useState, useEffect } from 'react';
import API from '../../api/axios';
import ParkingMap from '../../components/ParkingMap';
import { FiSend, FiMapPin } from 'react-icons/fi';

export default function BookSlot() {
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ vehicle_id: '', slot_type: 'Car', location_id: '', preferred_level: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [vRes, lRes, sRes] = await Promise.all([
        API.get('/vehicles/my'),
        API.get('/locations'),
        API.get('/slots')
      ]);
      setVehicles(Array.isArray(vRes.data) ? vRes.data : []);
      setLocations(Array.isArray(lRes.data) ? lRes.data : []);
      setSlots(Array.isArray(sRes.data) ? sRes.data : []);
    } catch (err) {
      console.error('Load data error:', err);
      setLoadError('Failed to load data. Please refresh the page.');
    }
  };

  const filteredSlots = slots.filter(s => {
    if (form.location_id && s.location_id != form.location_id) return false;
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/bookings', form);
      setSuccess('Booking request submitted! The admin will review your request.');
      setForm({ vehicle_id: '', slot_type: 'Car', location_id: '', preferred_level: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Book a Parking Slot</h1>
        <p>Submit a booking request — admin will approve and assign a slot</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Booking Form */}
        <div className="glass-card animate-fade-in">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Booking Request</h3>
          
          {loadError && (
            <div style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171', fontSize: '13px', marginBottom: '16px'
            }}>{loadError}</div>
          )}

          {success && (
            <div style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald-light)', fontSize: '13px', marginBottom: '16px'
            }}>{success}</div>
          )}
          {error && (
            <div style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171', fontSize: '13px', marginBottom: '16px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Your Vehicle</label>
                <select className="input-field" value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} required>
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => <option key={v.vehicle_id} value={v.vehicle_id}>{v.vehicle_no} — {v.vehicle_type}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Slot Type</label>
                <select className="input-field" value={form.slot_type} onChange={e => setForm({...form, slot_type: e.target.value})}>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
              <div className="input-group">
                <label>Location</label>
                <select className="input-field" value={form.location_id} onChange={e => setForm({...form, location_id: e.target.value})}>
                  <option value="">{locations.length === 0 ? 'No locations available' : 'Any location'}</option>
                  {locations.map(l => <option key={l.location_id} value={l.location_id}>{l.location_name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Preferred Level</label>
                <input type="number" className="input-field" min="1" placeholder="Any"
                  value={form.preferred_level} onChange={e => setForm({...form, preferred_level: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Submitting...' : <><FiSend /> Submit Request</>}
              </button>
            </div>
          </form>

          {vehicles.length === 0 && (
            <div style={{
              marginTop: '16px', padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber)', fontSize: '13px'
            }}>
              ⚠️ No vehicles registered. Please add a vehicle first in "My Vehicles".
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div className="glass-card animate-fade-in">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiMapPin style={{ color: 'var(--accent-blue-light)' }} /> Available Slots
          </h3>
          <ParkingMap slots={filteredSlots} />
        </div>
      </div>
    </div>
  );
}
