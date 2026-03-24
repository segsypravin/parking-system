const jwt = require('jsonwebtoken');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (req.user.user_type !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
