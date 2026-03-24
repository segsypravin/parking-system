const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Mock user list
const mockUsers = [
  { user_id: 1, name: 'Mock User', email: 'user@example.com', contact_no: '0000000000', user_type: 'User' },
  { user_id: 2, name: 'Mock Admin', email: 'admin@example.com', contact_no: '1111111111', user_type: 'Admin' }
];

// Get all users (admin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch
    // Example: SELECT user_id, name, email, contact_no, user_type FROM user
    
    res.json(mockUsers);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // TODO: Implement SQL Fetch by ID
    // Example: SELECT * FROM user WHERE user_id = ?
    
    const user = mockUsers.find(u => u.user_id == req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// Update user (admin)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, contact_no, user_type } = req.body;
    
    // TODO: Implement SQL Update
    // Example: UPDATE user SET name = ?, ... WHERE user_id = ?

    res.json({ message: 'User updated successfully (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Delete user (admin)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    // TODO: Implement SQL Delete
    // Example: DELETE FROM user WHERE user_id = ?

    res.json({ message: 'User deleted successfully (Mock).' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
