const pool = require('../db/connection');

// POST /api/users
const createUser = async (req, res) => {
    try {
        const { user_id, name, contact_no, user_type } = req.body;
        if (!user_id || !name) {
            return res.status(400).json({ error: 'user_id and name are required' });
        }
        const [result] = await pool.execute(
            'INSERT INTO user (user_id, name, contact_no, user_type) VALUES (?, ?, ?, ?)',
            [user_id, name, contact_no || null, user_type || null]
        );
        res.status(201).json({ message: 'User created successfully', user_id });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User with this user_id already exists' });
        }
        res.status(500).json({ error: err.message });
    }
};

// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM user');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM user WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const { name, contact_no, user_type } = req.body;
        const [result] = await pool.execute(
            'UPDATE user SET name = ?, contact_no = ?, user_type = ? WHERE user_id = ?',
            [name, contact_no, user_type, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM user WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
