const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all slots (filterable by location_id, status, level)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { location_id, slot_status, slot_level } = req.query;
    
    let sql = "SELECT ps.*, l.location_name FROM parking_slot ps LEFT JOIN location l ON ps.location_id = l.location_id WHERE 1=1";
    const params = [];

    if (location_id) {
      sql += " AND ps.location_id = ?";
      params.push(location_id);
    }
    if (slot_status) {
      sql += " AND ps.slot_status = ?";
      params.push(slot_status);
    }
    if (slot_level) {
      sql += " AND ps.slot_level = ?";
      params.push(slot_level);
    }

    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error('Get slots error:', err);
    res.status(500).json({ error: 'Failed to fetch slots.' });
  }
});

// Get slot stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const [totalRes] = await db.query("SELECT COUNT(*) as count FROM parking_slot");
    const [occupiedRes] = await db.query("SELECT COUNT(*) as count FROM parking_slot WHERE slot_status = 'Occupied'");
    const [availableRes] = await db.query("SELECT COUNT(*) as count FROM parking_slot WHERE slot_status = 'Available'");
    const [reservedRes] = await db.query("SELECT COUNT(*) as count FROM parking_slot WHERE slot_status = 'Reserved'");
    
    res.json({
      total: totalRes[0].count,
      occupied: occupiedRes[0].count,
      available: availableRes[0].count,
      reserved: reservedRes[0].count
    });
  } catch (err) {
    console.error('Get slot stats error:', err);
    res.status(500).json({ error: 'Failed to fetch slot stats.' });
  }
});

// Add slot (admin)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_type, slot_level, slot_priority, slot_status, location_id } = req.body;
    
    const sql = "INSERT INTO parking_slot (slot_type, slot_level, slot_priority, slot_status, location_id) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [slot_type, slot_level, slot_priority, slot_status || 'Available', location_id]);

    res.status(201).json({ message: 'Slot added successfully', slot_id: result.insertId });
  } catch (err) {
    console.error('Add slot error:', err);
    res.status(500).json({ error: 'Failed to add slot.' });
  }
});

// Update slot status (admin)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_status } = req.body;
    
    const sql = "UPDATE parking_slot SET slot_status = ? WHERE slot_id = ?";
    await db.query(sql, [slot_status, req.params.id]);

    res.json({ message: 'Slot status updated successfully' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update slot status.' });
  }
});

// Update slot (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_type, slot_level, slot_priority, slot_status, location_id } = req.body;
    
    const sql = "UPDATE parking_slot SET slot_type = ?, slot_level = ?, slot_priority = ?, slot_status = ?, location_id = ? WHERE slot_id = ?";
    await db.query(sql, [slot_type, slot_level, slot_priority, slot_status, location_id, req.params.id]);

    res.json({ message: 'Slot updated successfully' });
  } catch (err) {
    console.error('Update slot error:', err);
    res.status(500).json({ error: 'Failed to update slot.' });
  }
});

// Delete slot (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sql = "DELETE FROM parking_slot WHERE slot_id = ?";
    await db.query(sql, [req.params.id]);

    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    console.error('Delete slot error:', err);
    res.status(500).json({ error: 'Failed to delete slot.' });
  }
});

module.exports = router;

