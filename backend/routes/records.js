const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock data
const mockRecords = [
  { record_id: 1001, vehicle_id: 1, vehicle_no: 'ABC-123', vehicle_type: 'Car', owner_name: 'Mock User', slot_id: 1, slot_type: 'Car', slot_level: 1, entry_time: new Date(), rotation_status: 'Active' }
];

// Get all parking records with vehicle & slot info
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch with joins
    // Example: SELECT pr.*, v.vehicle_no, u.name, ps.slot_type FROM parking_record pr ...

    res.json(mockRecords);
  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// Record vehicle entry (admin)
router.post('/entry', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { vehicle_id, slot_id } = req.body;

    // TODO: Implement SQL Transaction:
    // 1. Check slot availability
    // 2. Insert into parking_record
    // 3. Update slot status to 'Occupied'

    res.status(201).json({ message: 'Vehicle entry recorded (Mock).', record_id: Date.now() });
  } catch (err) {
    console.error('Entry error:', err);
    res.status(500).json({ error: 'Failed to record entry.' });
  }
});

// Record vehicle exit (admin)
router.put('/:id/exit', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Transaction:
    // 1. Get entry_time from parking_record
    // 2. Calculate duration and charges
    // 3. Update parking_record (exit_time, charges, etc.)
    // 4. Update slot status to 'Available'

    res.json({ message: 'Vehicle exit recorded (Mock).', duration: 1, charges: 25.00 });
  } catch (err) {
    console.error('Exit error:', err);
    res.status(500).json({ error: 'Failed to record exit.' });
  }
});

module.exports = router;
