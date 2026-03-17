const pool = require('../db/connection');

// GET /api/slots
const getAllSlots = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM parking_slot');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/slots/available
const getAvailableSlots = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM parking_slot WHERE slot_status = 'Available'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/slots/:id
const getSlotById = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM parking_slot WHERE slot_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Slot not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/slots
const createSlot = async (req, res) => {
    try {
        const { slot_id, slot_type, slot_level, slot_priority, slot_status } = req.body;
        if (!slot_id) {
            return res.status(400).json({ error: 'slot_id is required' });
        }
        await pool.execute(
            'INSERT INTO parking_slot (slot_id, slot_type, slot_level, slot_priority, slot_status) VALUES (?, ?, ?, ?, ?)',
            [slot_id, slot_type || null, slot_level || null, slot_priority || null, slot_status || 'Available']
        );
        res.status(201).json({ message: 'Parking slot created successfully', slot_id });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Slot with this slot_id already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/slots/:id
const updateSlot = async (req, res) => {
    try {
        const { slot_type, slot_level, slot_priority, slot_status } = req.body;
        const [result] = await pool.execute(
            'UPDATE parking_slot SET slot_type = ?, slot_level = ?, slot_priority = ?, slot_status = ? WHERE slot_id = ?',
            [slot_type, slot_level, slot_priority, slot_status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Slot not found' });
        res.json({ message: 'Parking slot updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/slots/:id
const deleteSlot = async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM parking_slot WHERE slot_id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Slot not found' });
        res.json({ message: 'Parking slot deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllSlots, getAvailableSlots, getSlotById, createSlot, updateSlot, deleteSlot };
