const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-bem-ums-123');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Sesi telah habis atau token tidak valid.' });
  }
};

module.exports = authMiddleware;
