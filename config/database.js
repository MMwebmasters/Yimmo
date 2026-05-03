const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database.db');

let db;

const initialize = () => {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Erreur connexion DB:', err);
    } else {
      console.log('✓ Base de données connectée');
      createTables();
    }
  });
};

const createTables = () => {
  db.serialize(() => {
    // Table des projets
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        images TEXT,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des paramètres du site
    db.run(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des messages de contact
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new'
      )
    `);

    // Table des rendez-vous
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        message TEXT,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        response_message TEXT
      )
    `);

    // Table des utilisateurs admin
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Insérer l'admin par défaut si n'existe pas
      db.get('SELECT * FROM admin_users WHERE email = ?',
        [process.env.ADMIN_EMAIL || 'Yousri@yimmosarl.com'],
        (err, row) => {
          if (!row) {
            const hashedPassword = bcrypt.hashSync(
              process.env.ADMIN_PASSWORD || 'changeme123',
              10
            );
            db.run(
              'INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)',
              [process.env.ADMIN_EMAIL || 'Yousri@yimmosarl.com', hashedPassword, 'Yousri'],
              (err) => {
                if (!err) {
                  console.log('✓ Compte admin créé');
                }
              }
            );
          }
        }
      );
    });

    // Insérer les paramètres par défaut
    insertDefaultSettings();
  });
};

const insertDefaultSettings = () => {
  const defaults = {
    company_name:  'Yimmo',
    tagline:       'Yimmo le bras droit des propriétaires',
    address:       'Rue de Genève 67',
    phone:         '+41 78 243 03 94',
    email:         'Yousri@yimmosarl.com',
    whatsapp:      '41782430394',
    instagram:     'https://www.instagram.com/yimmosarl',
    hero_label:    'Menuiserie Premium · Genève',
    hero_subtitle: "Spécialisés dans les portes EI30 et les cuisines haut de gamme. Chaque projet est une signature, chaque réalisation une fierté.",
    stat1_number:  '5+',
    stat1_label:   "Ans d'expérience",
    stat2_number:  '200+',
    stat2_label:   'Projets réalisés',
    stat3_number:  '100%',
    stat3_label:   'Satisfaction client',
    about_text:    "Depuis plusieurs années, Yimmo accompagne les propriétaires dans leurs projets de menuiserie. Notre expertise se concentre sur deux domaines clés : les portes EI30 (portes coupe-feu de haute qualité) et les cuisines sur-mesure.\nChaque projet est traité avec rigueur et professionnalisme. Nous comprenons vos besoins, respectons vos délais, et livrons des solutions qui dépassent vos attentes.\nNotre philosophie : être le bras droit des propriétaires en leur proposant des menuiseries de qualité exceptionnelle, avec un service client irréprochable.",
    services_text: '',
    s1_title: 'Portes EI30',
    s1_desc:  'Portes coupe-feu certifiées EI30 de haute qualité. Sécurité optimale, design moderne et installation professionnelle.',
    s1_f1: 'Certification coupe-feu EI30', s1_f2: 'Design contemporain', s1_f3: 'Pose clé en main',
    s2_title: 'Cuisines Haut de Gamme',
    s2_desc:  'Cuisines sur-mesure combinant fonctionnalité et design. Matériaux premium et finitions impeccables.',
    s2_f1: 'Conception personnalisée', s2_f2: 'Matériaux haut de gamme', s2_f3: 'Finitions soignées',
    s3_title: 'Réalisations Complètes',
    s3_desc:  "Du projet initial à la pose finale, nous gérons l'intégralité de vos chantiers menuiserie avec professionnalisme.",
    s3_f1: 'Suivi de chantier', s3_f2: 'Respect des délais', s3_f3: 'Devis gratuit'
  };

  for (const [key, value] of Object.entries(defaults)) {
    db.run(
      'INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }
};

const getDB = () => db;

module.exports = {
  initialize,
  getDB
};
