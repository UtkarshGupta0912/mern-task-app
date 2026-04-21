const jwt = require('jsonwebtoken');

// This function runs BEFORE protected routes
module.exports = function(req, res, next) {
  // 1. Get token from request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 2. If no token, deny access
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    // 3. Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();             // continue to the route
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};