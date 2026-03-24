import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', contact_no: '', user_type: 'User' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${editUser.user_id}`, form);
      setShowModal(false);
      setEditUser(null);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, contact_no: u.contact_no, user_type: u.user_type });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await API.delete(`/users/${id}`);
    loadData();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage all registered users</p>
      </div>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Contact</th><th>Type</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td style={{ fontWeight: 600 }}>{u.user_id}</td>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>{u.contact_no}</td>
                  <td>
                    <span className={`badge ${u.user_type === 'Admin' ? 'badge-active' : 'badge-approved'}`}>
                      {u.user_type}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(u)}><FiEdit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.user_id)}><FiTrash2 size={14} /></button>
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
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Contact</label>
                    <input className="input-field" value={form.contact_no} onChange={e => setForm({...form, contact_no: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>User Type</label>
                    <select className="input-field" value={form.user_type} onChange={e => setForm({...form, user_type: e.target.value})}>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Student">Student</option>
                      <option value="Staff">Staff</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
