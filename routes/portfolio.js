const express = require('express');
const { getDB } = require('../config/database');

const router = express.Router();

// Récupérer tous les projets (publique)
router.get('/', (req, res) => {
  const { category } = req.query;
  const db = getDB();

  let query = 'SELECT * FROM projects';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY date_created DESC';

  db.all(query, params, (err, projects) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    const projectsWithImages = projects.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json(projectsWithImages);
  });
});

// Récupérer un projet spécifique
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();

  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, project) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    project.images = project.images ? JSON.parse(project.images) : [];
    res.json(project);
  });
});

module.exports = router;
