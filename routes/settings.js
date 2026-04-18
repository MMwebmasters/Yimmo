const express = require('express');
const { getDB } = require('../config/database');

const router = express.Router();

// Récupérer les paramètres publiques du site
router.get('/', (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM site_settings', (err, settings) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    const result = {};
    settings.forEach(s => {
      result[s.key] = s.value;
    });
    res.json(result);
  });
});

module.exports = router;
