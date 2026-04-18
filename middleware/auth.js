const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] ||
                req.cookies?.token ||
                req.body?.token;

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = { verifyToken };
