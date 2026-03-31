const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all bookings (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT b.*, u.name AS user_name, v.vehicle_no, l.location_name
      FROM booking b
      LEFT JOIN user u ON b.user_id = u.user_id
      LEFT JOIN vehicle v ON b.vehicle_id = v.vehicle_id
      LEFT JOIN location l ON b.location_id = l.location_id
      ORDER BY b.created_at DESC
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Get my bookings (user)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT b.*, v.vehicle_no, l.location_name,
             ps.slot_type AS assigned_slot_type, ps.slot_level AS assigned_slot_level
      FROM booking b
      LEFT JOIN vehicle v ON b.vehicle_id = v.vehicle_id
      LEFT JOIN location l ON b.location_id = l.location_id
      LEFT JOIN parking_slot ps ON b.slot_id = ps.slot_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;
    const [results] = await db.query(sql, [req.user.user_id]);
    res.json(results);
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Create booking (user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { vehicle_id, slot_type, location_id, preferred_level } = req.body;

    const sql = `
      INSERT INTO booking (user_id, vehicle_id, slot_type, location_id, preferred_level, status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;
    const [result] = await db.query(sql, [req.user.user_id, vehicle_id, slot_type, location_id, preferred_level]);

    res.status(201).json({ message: 'Booking request submitted successfully', booking_id: result.insertId });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// Approve booking & assign slot (admin)
router.put('/:id/approve', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { slot_id } = req.body;
    const bookingId = req.params.id;

    // Check if slot is available
    const [slots] = await db.query("SELECT * FROM parking_slot WHERE slot_id = ? AND slot_status = 'Available'", [slot_id]);
    if (slots.length === 0) {
      return res.status(400).json({ error: 'Slot is not available.' });
    }

    // Update booking status and assign slot
    await db.query("UPDATE booking SET status = 'Approved', slot_id = ? WHERE booking_id = ?", [slot_id, bookingId]);

    // Update slot status to Reserved
    await db.query("UPDATE parking_slot SET slot_status = 'Reserved' WHERE slot_id = ?", [slot_id]);

    res.json({ message: 'Booking approved and slot assigned successfully' });
  } catch (err) {
    console.error('Approve booking error:', err);
    res.status(500).json({ error: 'Failed to approve booking.' });
  }
});

// Reject booking (admin)
router.put('/:id/reject', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    await db.query("UPDATE booking SET status = 'Rejected', rejection_reason = ? WHERE booking_id = ?", [reason, req.params.id]);

    res.json({ message: 'Booking rejected successfully' });
  } catch (err) {
    console.error('Reject booking error:', err);
    res.status(500).json({ error: 'Failed to reject booking.' });
  }
});

module.exports = router;

