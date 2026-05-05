const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const db = getDB();
  db.get('SELECT * FROM admin_users WHERE LOWER(email) = LOWER(?)', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnecté' });
});

router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.admin });
});

module.exports = router;
