const pool = require('../db/connection');

// POST /api/records/park  – park a vehicle
const parkVehicle = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { record_id, vehicle_id, slot_id } = req.body;
        if (!record_id || !vehicle_id || !slot_id) {
            return res.status(400).json({ error: 'record_id, vehicle_id, and slot_id are required' });
        }

        await conn.beginTransaction();

        // 1. Verify slot exists and is Available
        const [slots] = await conn.execute(
            "SELECT * FROM parking_slot WHERE slot_id = ?",
            [slot_id]
        );
        if (slots.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Slot not found' });
        }
        if (slots[0].slot_status !== 'Available') {
            await conn.rollback();
            return res.status(409).json({ error: `Slot ${slot_id} is not available (status: ${slots[0].slot_status})` });
        }

        // 2. Verify vehicle exists
        const [vehicles] = await conn.execute(
            'SELECT * FROM vehicle WHERE vehicle_id = ?',
            [vehicle_id]
        );
        if (vehicles.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // 3. Insert parking record
        await conn.execute(
            `INSERT INTO parking_record (record_id, vehicle_id, slot_id, entry_time, rotation_status)
       VALUES (?, ?, ?, NOW(), 'Active')`,
            [record_id, vehicle_id, slot_id]
        );

        // 4. Mark slot as Occupied
        await conn.execute(
            "UPDATE parking_slot SET slot_status = 'Occupied' WHERE slot_id = ?",
            [slot_id]
        );

        await conn.commit();
        res.status(201).json({
            message: 'Vehicle parked successfully',
            record_id,
            vehicle_id,
            slot_id,
        });
    } catch (err) {
        await conn.rollback();
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Record ID already exists' });
        }
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
};

// PUT /api/records/exit/:record_id  – vehicle exits
const exitVehicle = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { record_id } = req.params;

        await conn.beginTransaction();

        // 1. Fetch the active record
        const [records] = await conn.execute(
            "SELECT * FROM parking_record WHERE record_id = ?",
            [record_id]
        );
        if (records.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: 'Parking record not found' });
        }
        const record = records[0];
        if (record.exit_time !== null) {
            await conn.rollback();
            return res.status(409).json({ error: 'Vehicle has already exited for this record' });
        }

        // 2. Calculate duration (minutes) and charges (₹25 per hour, min 1 hour)
        const now = new Date();
        const entry = new Date(record.entry_time);
        const durationMinutes = Math.ceil((now - entry) / 60000); // ms → minutes
        const durationHours = Math.ceil(durationMinutes / 60);
        const charges = durationHours * 25;

        // 3. Update the record
        await conn.execute(
            `UPDATE parking_record
       SET exit_time = NOW(), parking_duration = ?, charges = ?, rotation_status = 'Completed'
       WHERE record_id = ?`,
            [durationMinutes, charges, record_id]
        );

        // 4. Free the slot
        await conn.execute(
            "UPDATE parking_slot SET slot_status = 'Available' WHERE slot_id = ?",
            [record.slot_id]
        );

        await conn.commit();
        res.json({
            message: 'Vehicle exited successfully',
            record_id: Number(record_id),
            slot_id: record.slot_id,
            duration_minutes: durationMinutes,
            charges_inr: charges,
        });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
};

// GET /api/records
const getAllRecords = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT pr.*, v.vehicle_no, v.vehicle_type, ps.slot_type, ps.slot_level
       FROM parking_record pr
       LEFT JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
       LEFT JOIN parking_slot ps ON pr.slot_id = ps.slot_id
       ORDER BY pr.entry_time DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/records/active  – only currently parked vehicles
const getActiveRecords = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT pr.*, v.vehicle_no, v.vehicle_type, ps.slot_type, ps.slot_level
       FROM parking_record pr
       LEFT JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
       LEFT JOIN parking_slot ps ON pr.slot_id = ps.slot_id
       WHERE pr.exit_time IS NULL
       ORDER BY pr.entry_time DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/records/:id
const getRecordById = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT pr.*, v.vehicle_no, v.vehicle_type, ps.slot_type, ps.slot_level
       FROM parking_record pr
       LEFT JOIN vehicle v ON pr.vehicle_id = v.vehicle_id
       LEFT JOIN parking_slot ps ON pr.slot_id = ps.slot_id
       WHERE pr.record_id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/records/:id
const deleteRecord = async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM parking_record WHERE record_id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { parkVehicle, exitVehicle, getAllRecords, getActiveRecords, getRecordById, deleteRecord };
