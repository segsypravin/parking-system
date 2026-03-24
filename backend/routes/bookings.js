const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock bookings for demonstration
const mockBookings = [
  { booking_id: 1, user_id: 1, user_name: 'Mock User', contact_no: '0000000000', vehicle_id: 1, vehicle_no: 'ABC-123', vehicle_type: 'Car', slot_id: 1, slot_type: 'Car', slot_level: 1, status: 'Approved', booking_time: new Date() }
];

// Get all bookings (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch joins
    // Example: SELECT b.*, u.name, v.vehicle_no, ps.slot_type FROM booking b ...
    
    res.json(mockBookings);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Get my bookings (user)
router.get('/my', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch by user_id
    // Example: SELECT b.*, ps.slot_type FROM booking b ... WHERE b.user_id = ?
    
    const myBookings = mockBookings.filter(b => b.user_id === req.user.user_id);
    res.json(myBookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Create booking (user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { vehicle_id, slot_type, location_id, preferred_level } = req.body;

    // TODO: Implement SQL Insert
    // Example: INSERT INTO booking (user_id, vehicle_id, ...) VALUES (...)

    res.status(201).json({ message: 'Booking request submitted (Mock).', booking_id: Date.now() });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// Approve booking & assign slot (admin)
router.put('/:id/approve', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_id } = req.body;

    // TODO: Implement SQL Transaction:
    // 1. Check if slot is available
    // 2. Update booking status to 'Approved'
    // 3. Update slot status to 'Reserved'

    res.json({ message: 'Booking approved and slot assigned (Mock).' });
  } catch (err) {
    console.error('Approve booking error:', err);
    res.status(500).json({ error: 'Failed to approve booking.' });
  }
});

// Reject booking (admin)
router.put('/:id/reject', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    // TODO: Implement SQL Update status
    // Example: UPDATE booking SET status = 'Rejected', rejection_reason = ? WHERE booking_id = ?

    res.json({ message: 'Booking rejected (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject booking.' });
  }
});

module.exports = router;
