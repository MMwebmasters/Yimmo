const express = require('express');
const { getDB } = require('../config/database');
const { sendAppointmentConfirmation, sendContactFormConfirmation } = require('../config/email');

const router = express.Router();

// Heures disponibles: 8h à 20h, créneaux de 30min
const OPENING_HOUR = 8;
const CLOSING_HOUR = 20;
const SLOT_DURATION = 30; // minutes

// Générer les heures disponibles pour une date donnée
function getAvailableSlots(dateString) {
  const slots = [];
  const date = new Date(dateString);

  // Vérifier que la date n'est pas dans le passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return [];
  }

  // Récupérer les rendez-vous confirmés pour cette date
  return new Promise((resolve) => {
    const db = getDB();
    db.all(
      'SELECT preferred_time FROM appointments WHERE preferred_date = ? AND status = "confirmed"',
      [dateString],
      (err, rows) => {
        if (err) {
          resolve([]);
          return;
        }

        const bookedTimes = new Set();
        if (rows) {
          rows.forEach(row => {
            bookedTimes.add(row.preferred_time);
          });
        }

        // Générer tous les créneaux horaires
        for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
          for (let min = 0; min < 60; min += SLOT_DURATION) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            if (!bookedTimes.has(time)) {
              slots.push(time);
            }
          }
        }

        resolve(slots);
      }
    );
  });
}

// Récupérer les heures disponibles pour une date
router.get('/available-slots/:date', async (req, res) => {
  try {
    const slots = await getAvailableSlots(req.params.date);
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer un message de contact
router.post('/send', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs requis' });
  }

  const db = getDB();
  db.run(
    'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || '', subject || '', message],
    async function(err) {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });

      // Send confirmation email to client
      await sendContactFormConfirmation(email, name);

      res.json({ success: true, message: 'Message envoyé avec succès. Vous recevrez une confirmation par email.' });
    }
  );
});

// Prendre un rendez-vous
router.post('/appointment', async (req, res) => {
  const { name, email, phone, preferred_date, preferred_time, message } = req.body;

  if (!name || !email || !phone || !preferred_date || !preferred_time) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs requis' });
  }

  const db = getDB();

  // Vérifier que l'heure n'est pas déjà réservée
  db.get(
    'SELECT id FROM appointments WHERE preferred_date = ? AND preferred_time = ? AND status = "confirmed"',
    [preferred_date, preferred_time],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (row) {
        return res.status(409).json({ error: 'Cet horaire n\'est plus disponible' });
      }

      // Créer le rendez-vous
      db.run(
        'INSERT INTO appointments (name, email, phone, preferred_date, preferred_time, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, preferred_date, preferred_time, message || ''],
        async function(err) {
          if (err) return res.status(500).json({ error: 'Erreur serveur' });

          // Send appointment request confirmation email to client
          await sendAppointmentConfirmation(email, name, {
            preferred_date,
            preferred_time,
            phone,
          }, 'Votre demande de rendez-vous a été reçue. Nous vous confirmerons rapidement si cet horaire est disponible.');

          res.json({ success: true, message: 'Rendez-vous demandé avec succès. Vous recevrez une confirmation par email.' });
        }
      );
    }
  );
});

module.exports = router;
