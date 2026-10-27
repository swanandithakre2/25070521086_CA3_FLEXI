const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'expenses_jwt_secret_key_2026';

const authMiddleware = (req, res, next) => {
  // Get token from header: "Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains id, email, name
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = {
  authMiddleware,
  JWT_SECRET
};
