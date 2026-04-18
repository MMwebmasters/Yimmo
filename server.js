const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser la base de données
const db = require('./config/database');
db.initialize();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));

// Servir l'application frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Page admin (protégée par authentification)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Page login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Serveur Yimmo démarré sur http://localhost:${PORT}`);
  console.log('→ Site public: http://localhost:' + PORT);
  console.log('→ Admin: http://localhost:' + PORT + '/admin');
});
