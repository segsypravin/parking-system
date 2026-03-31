const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all parking records with vehicle & slot info
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const sql = `
      SELECT pr.*, v.vehicle_no, u.name AS user_name, ps.slot_type, ps.slot_level
      FROM parking_record pr
      LEFT JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
      LEFT JOIN user u ON v.user_id = u.user_id
      LEFT JOIN parking_slot ps ON pr.slot_id = ps.slot_id
      ORDER BY pr.entry_time DESC
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
});

// Record vehicle entry (admin)
router.post('/entry', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { vehicle_id, slot_id } = req.body;

    // Check slot availability
    const [slots] = await db.query("SELECT * FROM parking_slot WHERE slot_id = ? AND slot_status = 'Available'", [slot_id]);
    if (slots.length === 0) {
      return res.status(400).json({ error: 'Slot is not available.' });
    }

    // Insert parking record
    const sql = "INSERT INTO parking_record (vehicle_id, slot_id, entry_time) VALUES (?, ?, NOW())";
    const [result] = await db.query(sql, [vehicle_id, slot_id]);

    // Update slot status to Occupied
    await db.query("UPDATE parking_slot SET slot_status = 'Occupied' WHERE slot_id = ?", [slot_id]);

    res.status(201).json({ message: 'Vehicle entry recorded successfully', record_id: result.insertId });
  } catch (err) {
    console.error('Entry error:', err);
    res.status(500).json({ error: 'Failed to record entry.' });
  }
});

// Record vehicle exit (admin)
router.put('/:id/exit', verifyToken, requireAdmin, async (req, res) => {
  try {
    const recordId = req.params.id;

    // Get parking record
    const [records] = await db.query("SELECT * FROM parking_record WHERE record_id = ? AND exit_time IS NULL", [recordId]);
    if (records.length === 0) {
      return res.status(404).json({ error: 'Active parking record not found.' });
    }
    const record = records[0];

    // Calculate duration in hours
    const entryTime = new Date(record.entry_time);
    const exitTime = new Date();
    const durationHours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));

    // Get the slot type to determine rate
    const [slots] = await db.query("SELECT * FROM parking_slot WHERE slot_id = ?", [record.slot_id]);
    const slotType = slots.length > 0 ? slots[0].slot_type : 'Standard';

    // Get charges from parking_charges table (default to 20 per hour if not found)
    let ratePerHour = 20;
    try {
      const [charges] = await db.query("SELECT * FROM parking_charges WHERE slot_type = ?", [slotType]);
      if (charges.length > 0) ratePerHour = charges[0].rate_per_hour || charges[0].charge_amount || 20;
    } catch (e) { /* use default */ }

    const totalCharges = durationHours * ratePerHour;

    // Update parking record with exit details
    await db.query(
      "UPDATE parking_record SET exit_time = NOW(), duration_hours = ?, total_charges = ? WHERE record_id = ?",
      [durationHours, totalCharges, recordId]
    );

    // Update slot status back to Available
    await db.query("UPDATE parking_slot SET slot_status = 'Available' WHERE slot_id = ?", [record.slot_id]);

    res.json({
      message: 'Vehicle exit recorded successfully',
      duration_hours: durationHours,
      total_charges: totalCharges
    });
  } catch (err) {
    console.error('Exit error:', err);
    res.status(500).json({ error: 'Failed to record exit.' });
  }
});

module.exports = router;

