const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
  // Middleware for required authentication
  required: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
      
      if (!user) {
        throw new Error();
      }
      
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: 'Please authenticate'
      });
    }
  },
  
  // Middleware for optional authentication
  optional: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if (user) {
          req.token = token;
          req.user = user;
        }
      }
      
      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  }
};

module.exports = auth;