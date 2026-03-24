const pool = require('../db/connection');

// POST /api/vehicles  – register a new vehicle
const registerVehicle = async (req, res) => {
    try {
        const { vehicle_id, vehicle_no, vehicle_type, frequent_visitor, user_id } = req.body;
        if (!vehicle_id || !vehicle_no) {
            return res.status(400).json({ error: 'vehicle_id and vehicle_no are required' });
        }
        await pool.execute(
            'INSERT INTO vehicle (vehicle_id, vehicle_no, vehicle_type, frequent_visitor, user_id) VALUES (?, ?, ?, ?, ?)',
            [vehicle_id, vehicle_no, vehicle_type || null, frequent_visitor || 'N', user_id || null]
        );
        res.status(201).json({ message: 'Vehicle registered successfully', vehicle_id });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Vehicle with this vehicle_id already exists' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Referenced user_id does not exist' });
        }
        res.status(500).json({ error: err.message });
    }
};

// GET /api/vehicles
const getAllVehicles = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT v.*, u.name AS owner_name, u.contact_no, u.user_type
       FROM vehicle v
       LEFT JOIN user u ON v.user_id = u.user_id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT v.*, u.name AS owner_name, u.contact_no, u.user_type
       FROM vehicle v
       LEFT JOIN user u ON v.user_id = u.user_id
       WHERE v.vehicle_id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
    try {
        const { vehicle_no, vehicle_type, frequent_visitor, user_id } = req.body;
        const [result] = await pool.execute(
            'UPDATE vehicle SET vehicle_no = ?, vehicle_type = ?, frequent_visitor = ?, user_id = ? WHERE vehicle_id = ?',
            [vehicle_no, vehicle_type, frequent_visitor, user_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM vehicle WHERE vehicle_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle };
