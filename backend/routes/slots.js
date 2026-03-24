const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock data for initial development
const mockSlots = [
  { slot_id: 1, slot_type: 'Car', slot_level: 1, slot_priority: 1, slot_status: 'Available', location_id: 1, location_name: 'Main Gate' },
  { slot_id: 2, slot_type: 'Car', slot_level: 1, slot_priority: 2, slot_status: 'Occupied', location_id: 1, location_name: 'Main Gate' },
  { slot_id: 3, slot_type: 'Bike', slot_level: 2, slot_priority: 1, slot_status: 'Available', location_id: 2, location_name: 'Entry B' }
];

// Get all slots (filterable by location_id, status, level)
router.get('/', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch with filters
    // Example: SELECT ps.*, pl.location_name FROM parking_slot ps LEFT JOIN ... WHERE ...
    
    // Filtering mock data for demonstration
    let filteredSlots = [...mockSlots];
    if (req.query.location_id) filteredSlots = filteredSlots.filter(s => s.location_id == req.query.location_id);
    if (req.query.status) filteredSlots = filteredSlots.filter(s => s.slot_status == req.query.status);
    if (req.query.level) filteredSlots = filteredSlots.filter(s => s.slot_level == req.query.level);

    res.json(filteredSlots);
  } catch (err) {
    console.error('Get slots error:', err);
    res.status(500).json({ error: 'Failed to fetch slots.' });
  }
});

// Get slot stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Aggregate queries
    // Example: SELECT COUNT(*) FROM parking_slot WHERE slot_status = 'Occupied'
    
    res.json({
      total: mockSlots.length,
      occupied: mockSlots.filter(s => s.slot_status === 'Occupied').length,
      available: mockSlots.filter(s => s.slot_status === 'Available').length,
      reserved: mockSlots.filter(s => s.slot_status === 'Reserved').length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slot stats.' });
  }
});

// Add slot (admin)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_type, slot_level, slot_priority, slot_status, location_id } = req.body;
    
    // TODO: Implement SQL Insert
    // Example: INSERT INTO parking_slot (slot_type, ...) VALUES (...)

    res.status(201).json({ message: 'Slot added (Mock).', slot_id: Date.now() });
  } catch (err) {
    console.error('Add slot error:', err);
    res.status(500).json({ error: 'Failed to add slot.' });
  }
});

// Update slot status (admin)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_status } = req.body;
    
    // TODO: Implement SQL Update status
    // Example: UPDATE parking_slot SET slot_status = ? WHERE slot_id = ?

    res.json({ message: 'Slot status updated (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update slot.' });
  }
});

// Update slot (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_type, slot_level, slot_priority, slot_status, location_id } = req.body;
    
    // TODO: Implement SQL Update all fields
    // Example: UPDATE parking_slot SET slot_type = ?, ... WHERE slot_id = ?

    res.json({ message: 'Slot updated (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update slot.' });
  }
});

// Delete slot (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Delete
    // Example: DELETE FROM parking_slot WHERE slot_id = ?

    res.json({ message: 'Slot deleted (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete slot.' });
  }
});

module.exports = router;
