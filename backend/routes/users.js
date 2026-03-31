const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all users (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sql = "SELECT user_id, name, email, contact_no, user_type, parking_charges FROM user";
    
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const sql = "SELECT user_id, name, email, contact_no, user_type, parking_charges FROM user WHERE user_id = ?";
    
    const [results] = await db.query(sql, [req.params.id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// Update user (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, contact_no, user_type } = req.body;
    
    const sql = "UPDATE user SET name = ?, contact_no = ?, user_type = ? WHERE user_id = ?";

    await db.query(sql, [name, contact_no, user_type, req.params.id]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Delete user (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sql = "DELETE FROM user WHERE user_id = ?";

    await db.query(sql, [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;

