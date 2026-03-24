const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contact_no, user_type } = req.body;

    // TODO: Implement SQL Check: if email already exists
    // Example: SELECT * FROM user WHERE email = email

    // TODO: Implement SQL Insert: create new user
    // Example: INSERT INTO user (name, email, password, contact_no, user_type) VALUES (...)

    const userId = Date.now(); // Temporary mock ID

    const token = jwt.sign(
      { user_id: userId, name, email, user_type: user_type || 'User' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful (Mock)',
      token,
      user: { user_id: userId, name, email, user_type: user_type || 'User' }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: Implement SQL Check: verify credentials
    // Example: SELECT * FROM user WHERE email = email AND password = password

    // Mock successful login for demonstration
    const userId = 1;
    const token = jwt.sign(
      { user_id: userId, name: 'Mock User', email, user_type: 'User' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful (Mock)',
      token,
      user: {
        user_id: userId,
        name: 'Mock User',
        email: email,
        user_type: 'User'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // TODO: Implement SQL Fetch: get user details by ID
    // Example: SELECT user_id, name, email, contact_no, user_type FROM user WHERE user_id = decoded.user_id

    res.json({
      user_id: decoded.user_id,
      name: decoded.name || 'Mock User',
      email: decoded.email,
      contact_no: '0000000000',
      user_type: decoded.user_type
    });
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
