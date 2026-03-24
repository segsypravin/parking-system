const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock data
const mockLocations = [
  { location_id: 1, location_name: 'Main Gate', address: '123 Main St', total_levels: 2, total_slots: 10, available_slots: 5 }
];

// Get all locations
router.get('/', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch with counts
    // Example: SELECT pl.*, (SELECT COUNT(*) FROM parking_slot ...) FROM parking_location pl
    
    res.json(mockLocations);
  } catch (err) {
    console.error('Get locations error:', err);
    res.status(500).json({ error: 'Failed to fetch locations.' });
  }
});

// Add location (admin)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { location_name, address, total_levels } = req.body;
    
    // TODO: Implement SQL Insert
    // Example: INSERT INTO parking_location (...) VALUES (...)

    res.status(201).json({ message: 'Location added (Mock).', location_id: Date.now() });
  } catch (err) {
    console.error('Add location error:', err);
    res.status(500).json({ error: 'Failed to add location.' });
  }
});

// Update location (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { location_name, address, total_levels } = req.body;
    
    // TODO: Implement SQL Update
    // Example: UPDATE parking_location SET ... WHERE location_id = ?

    res.json({ message: 'Location updated (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location.' });
  }
});

// Delete location (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Delete
    // Example: DELETE FROM parking_location WHERE location_id = ?

    res.json({ message: 'Location deleted (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location.' });
  }
});

module.exports = router;
