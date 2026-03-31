const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all vehicles with owner info (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT v.*, u.name AS owner_name, u.email AS owner_email
      FROM vehicle v
      LEFT JOIN user u ON v.user_id = u.user_id
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Get vehicles by logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM vehicle WHERE user_id = ?", [req.user.user_id]);
    res.json(results);
  } catch (err) {
    console.error('Get my vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Add vehicle
router.post('/', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor } = req.body;
    const userId = req.body.user_id || req.user.user_id;

    const sql = "INSERT INTO vehicle (vehicle_no, vehicle_type, frequent_visitor, user_id) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [vehicle_no, vehicle_type, frequent_visitor || 0, userId]);

    res.status(201).json({ message: 'Vehicle added successfully', vehicle_id: result.insertId });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ error: 'Failed to add vehicle.' });
  }
});

// Update vehicle
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor } = req.body;

    const sql = "UPDATE vehicle SET vehicle_no = ?, vehicle_type = ?, frequent_visitor = ? WHERE vehicle_id = ?";
    await db.query(sql, [vehicle_no, vehicle_type, frequent_visitor, req.params.id]);

    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
});

// Delete vehicle (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM vehicle WHERE vehicle_id = ?", [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

module.exports = router;

