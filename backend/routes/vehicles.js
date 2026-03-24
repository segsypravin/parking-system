const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock data
const mockVehicles = [
  { vehicle_id: 101, vehicle_no: 'ABC-123', vehicle_type: 'Car', frequent_visitor: 'Y', user_id: 1, owner_name: 'Mock User', owner_contact: '0000000000' }
];

// Get all vehicles with owner info
router.get('/', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch with join
    // Example: SELECT v.*, u.name as owner_name FROM vehicle v LEFT JOIN user u ...

    res.json(mockVehicles);
  } catch (err) {
    console.error('Get vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Get vehicles by user
router.get('/my', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch by user_id
    // Example: SELECT * FROM vehicle WHERE user_id = ?
    
    const myVehicles = mockVehicles.filter(v => v.user_id === req.user.user_id);
    res.json(myVehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Add vehicle
router.post('/', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor, user_id } = req.body;
    
    // TODO: Implement SQL Insert
    // Example: INSERT INTO vehicle (...) VALUES (...)

    res.status(201).json({ message: 'Vehicle added (Mock).', vehicle_id: Date.now() });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ error: 'Failed to add vehicle.' });
  }
});

// Update vehicle
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor } = req.body;
    
    // TODO: Implement SQL Update
    // Example: UPDATE vehicle SET ... WHERE vehicle_id = ?

    res.json({ message: 'Vehicle updated (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
});

// Delete vehicle
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Delete
    // Example: DELETE FROM vehicle WHERE vehicle_id = ?

    res.json({ message: 'Vehicle deleted (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

module.exports = router;
