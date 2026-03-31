const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const db = require('../db');

// Get all vehicles with owner info (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT v.*, u.name AS owner_name, u.email AS owner_email
      FROM vehicle v
      LEFT JOIN user u ON v.user_id = u.user_id
    `;
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Get vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Get vehicles by logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM vehicle WHERE user_id = ?", [req.user.user_id]);
    res.json(results);
  } catch (err) {
    console.error('Get my vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
});

// Add vehicle
router.post('/', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor, user_id } = req.body;
    
    // Regular users can only add for themselves. Admins can add for anyone.
    const userId = (req.user.user_type === 'Admin' && user_id) ? user_id : req.user.user_id;


    if (!vehicle_no || !vehicle_no.trim()) {
      return res.status(400).json({ error: 'Vehicle number is required.' });
    }
    if (!vehicle_type || !['Car', 'Bike'].includes(vehicle_type)) {
      return res.status(400).json({ error: 'Vehicle type must be Car or Bike.' });
    }

    // Normalize frequent_visitor to 'Y' or 'N'
    const fv = (frequent_visitor === 'Y' || frequent_visitor === true || frequent_visitor === 1) ? 'Y' : 'N';

    const sql = "INSERT INTO vehicle (vehicle_no, vehicle_type, frequent_visitor, user_id) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [vehicle_no.trim().toUpperCase(), vehicle_type, fv, userId]);

    res.status(201).json({ message: 'Vehicle added successfully', vehicle_id: result.insertId });
  } catch (err) {
    console.error('Add vehicle error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'This vehicle number is already registered.' });
    }
    res.status(500).json({ error: 'Failed to add vehicle.' });
  }
});

// Update vehicle
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { vehicle_no, vehicle_type, frequent_visitor, user_id } = req.body;

    if (!vehicle_no || !vehicle_no.trim()) {
      return res.status(400).json({ error: 'Vehicle number is required.' });
    }

    const fv = (frequent_visitor === 'Y' || frequent_visitor === true || frequent_visitor === 1) ? 'Y' : 'N';

    // Build the dynamic SQL to avoid updating user_id for regular users
    let sql = "UPDATE vehicle SET vehicle_no = ?, vehicle_type = ?, frequent_visitor = ?";
    let params = [vehicle_no.trim().toUpperCase(), vehicle_type, fv];

    if (req.user.user_type === 'Admin' && user_id) {
      sql += ", user_id = ?";
      params.push(user_id);
    }

    sql += " WHERE vehicle_id = ?";
    params.push(req.params.id);

    await db.query(sql, params);


    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
});

// Delete vehicle (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM vehicle WHERE vehicle_id = ?", [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
});

module.exports = router;

