const express = require('express');
const { getDB } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { sendAppointmentConfirmation, sendAppointmentRejection } = require('../config/email');

const router = express.Router();

// Middleware pour vérifier le token sur toutes les routes admin
router.use(verifyToken);

// Récupérer tous les projets
router.get('/projects', (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM projects ORDER BY date_created DESC', (err, projects) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(projects);
  });
});

// Créer un projet
router.post('/projects', (req, res) => {
  const { title, description, category, images } = req.body;
  const db = getDB();

  db.run(
    'INSERT INTO projects (title, description, category, images) VALUES (?, ?, ?, ?)',
    [title, description, category, JSON.stringify(images || [])],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ id: this.lastID, success: true });
    }
  );
});

// Modifier un projet
router.put('/projects/:id', (req, res) => {
  const { title, description, category, images } = req.body;
  const { id } = req.params;
  const db = getDB();

  db.run(
    'UPDATE projects SET title = ?, description = ?, category = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, category, JSON.stringify(images || []), id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ success: true });
    }
  );
});

// Supprimer un projet
router.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.run('DELETE FROM projects WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ success: true });
  });
});

// Récupérer les paramètres du site
router.get('/settings', (req, res) => {
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

// Mettre à jour les paramètres du site
router.post('/settings', (req, res) => {
  const db = getDB();
  const { key, value } = req.body;

  db.run(
    'INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [key, value],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      res.json({ success: true });
    }
  );
});

// Récupérer les contacts
router.get('/contacts', (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM contacts ORDER BY date_created DESC', (err, contacts) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(contacts);
  });
});

// Marquer un contact comme lu
router.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDB();

  db.run('UPDATE contacts SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ success: true });
  });
});

// Récupérer les rendez-vous
router.get('/appointments', (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM appointments ORDER BY date_created DESC', (err, appointments) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(appointments);
  });
});

// Mettre à jour le statut d'un rendez-vous
router.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status, response_message } = req.body;
  const db = getDB();

  // Récupérer les détails du rendez-vous avant la mise à jour
  db.get('SELECT * FROM appointments WHERE id = ?', [id], async (err, appointment) => {
    if (err || !appointment) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Mettre à jour le rendez-vous
    db.run(
      'UPDATE appointments SET status = ?, response_message = ? WHERE id = ?',
      [status, response_message || '', id],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });

        // Envoyer email au client selon le statut
        if (status === 'confirmed') {
          await sendAppointmentConfirmation(
            appointment.email,
            appointment.name,
            {
              preferred_date: appointment.preferred_date,
              preferred_time: appointment.preferred_time,
              phone: appointment.phone,
            },
            response_message
          );
        } else if (status === 'refused') {
          await sendAppointmentRejection(
            appointment.email,
            appointment.name,
            {
              preferred_date: appointment.preferred_date,
              preferred_time: appointment.preferred_time,
              phone: appointment.phone,
            },
            response_message
          );
        }

        res.json({ success: true });
      }
    );
  });
});

module.exports = router;
