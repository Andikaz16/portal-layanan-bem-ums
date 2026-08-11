const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-bem-ums-123');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Sesi telah habis atau token tidak valid.' });
  }
};

module.exports = authMiddleware;
