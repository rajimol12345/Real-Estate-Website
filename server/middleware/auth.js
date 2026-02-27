const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      const secret = process.env.JWT_SECRET || 'estatepro_default_temporary_secret_2026';
      
      console.log(`Auth check: Token starts with "${token ? token.substring(0, 10) : 'null'}..."`);
      if (!process.env.JWT_SECRET) {
        console.warn('WARNING: JWT_SECRET is not defined in .env, using fallback.');
      }

      if (!token || token === 'undefined' || token === 'null' || token === '[object Object]') {
        console.error('MALFORMED or MISSING token received:', token);
        res.status(401);
        return res.json({ message: 'Not authorized, invalid token format' });
      }

      // Basic JWT structure check (3 parts)
      if (token.split('.').length !== 3) {
        console.error('JWT does not have 3 parts:', token.substring(0, 20));
        res.status(401);
        return res.json({ message: 'Not authorized, token malformed' });
      }

      // Verify token
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      res.status(401);
      // Don't just throw, send response if headers not sent
      if (!res.headersSent) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
      next(error);
    }
  } else {
    res.status(401);
    return res.json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
