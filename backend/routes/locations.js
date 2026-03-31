const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all locations with slot counts
router.get('/', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT l.*,
        (SELECT COUNT(*) FROM parking_slot ps WHERE ps.location_id = l.location_id) AS total_slots,
        (SELECT COUNT(*) FROM parking_slot ps WHERE ps.location_id = l.location_id AND ps.slot_status = 'Available') AS available_slots
      FROM location l
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({ error: 'Failed to fetch locations.' });
  }
});

// Add location (admin)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { location_name, address, total_levels } = req.body;

    const sql = "INSERT INTO location (location_name, address, total_levels) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [location_name, address, total_levels]);

    res.status(201).json({ message: 'Location added successfully', location_id: result.insertId });
  } catch (err) {
    console.error('Add location error:', err);
    res.status(500).json({ error: 'Failed to add location.' });
  }
});

// Update location (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { location_name, address, total_levels } = req.body;

    const sql = "UPDATE location SET location_name = ?, address = ?, total_levels = ? WHERE location_id = ?";
    await db.query(sql, [location_name, address, total_levels, req.params.id]);

    res.json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ error: 'Failed to update location.' });
  }
});

// Delete location (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM location WHERE location_id = ?", [req.params.id]);
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Delete location error:', err);
    res.status(500).json({ error: 'Failed to delete location.' });
  }
});

module.exports = router;

