# Yimmo - Site Vitrine Menuiserie

**Version:** 1.0.0
**Entreprise:** Yimmo SARL
**Date:** 2024

## 📋 Vue d'ensemble

Site vitrine professionnel pour **Yimmo**, menuiserie spécialisée dans les portes EI30 et les cuisines haut de gamme.

**Caractéristiques principales:**
- ✅ Site public responsive (mobile-first)
- ✅ Panneau admin sécurisé et intuitif
- ✅ Gestion complète des projets/réalisations
- ✅ Formulaires de contact et rendez-vous
- ✅ Base de données SQLite intégrée
- ✅ Design moderne (noir, doré, blanc)
- ✅ SEO-friendly
- ✅ WhatsApp intégré

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** (v14+) et npm
- **Windows**, **macOS**, ou **Linux**

### Étapes d'installation

1. **Accédez au répertoire du projet:**
   ```bash
   cd "c:\Users\moham\OneDrive\Bureau\Web Vitrine\yimmo"
   ```

2. **Installez les dépendances:**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement:**
   ```bash
   # Créez un fichier .env basé sur .env.example
   cp .env.example .env
   ```

   **Contenu du fichier .env:**
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=votre_clé_secrète_très_complexe_à_modifier
   ADMIN_EMAIL=Yousri@yimmosarl.com
   ADMIN_PASSWORD=changez_ce_mot_de_passe
   ```

   ⚠️ **IMPORTANT:** Changez le mot de passe admin avant le déploiement!

4. **Démarrez le serveur:**
   ```bash
   npm start
   ```

   Ou en mode développement avec rechargement automatique:
   ```bash
   npm run dev
   ```

5. **Accédez au site:**
   - **Site public:** http://localhost:3000
   - **Admin:** http://localhost:3000/admin

---

## 🔐 Accès Admin

### Connexion

Le lien d'accès admin est discret et caché. Pour y accéder:

1. Descendez au bas du site (footer)
2. Passez la souris sur le footer
3. Un petit cadenas (🔐) apparaît en bas à droite
4. Cliquez-le **3 fois rapidement**
5. Une fenêtre de connexion s'ouvre

**Identifiants par défaut:**
- Email: `Yousri@yimmosarl.com`
- Password: `changeme123` (à modifier dans .env)

### Fonctionnalités Admin

Une fois connecté, vous pouvez:

#### 📊 Tableau de bord
- Vue d'ensemble des statistiques
- Nombre de projets, messages, rendez-vous

#### 🏗️ Gestion des Projets
- **Ajouter** un nouveau projet (photo, description, catégorie)
- **Modifier** un projet existant
- **Supprimer** un projet
- Catégories: Portes EI30, Cuisines, Chantiers

#### ⚙️ Paramètres du Site
- Modifier le nom de l'entreprise
- Mettre à jour l'adresse, téléphone, email
- Éditer les textes "À propos" et "Services"
- **Les changements s'appliquent immédiatement**

#### 💬 Messages de Contact
- Consultez tous les messages reçus
- Marquez les messages comme "lus"
- Copiez l'email du client d'un clic
- Voyez la date/heure de chaque message

#### 📅 Rendez-vous
- Consultez les demandes de rendez-vous
- Statut: "En attente" ou "Confirmé"
- Contactez directement via WhatsApp
- Confirmez les rendez-vous

---

## 📁 Structure du Projet

```
yimmo/
├── public/                 # Fichiers publics
│   ├── index.html         # Site public
│   ├── admin.html         # Panneau admin
│   ├── css/
│   │   ├── styles.css     # Styles du site public
│   │   └── admin.css      # Styles admin
│   └── js/
│       ├── main.js        # JavaScript site public
│       └── admin.js       # JavaScript admin
├── routes/                # API routes
│   ├── auth.js           # Authentification
│   ├── admin.js          # Routes admin
│   ├── portfolio.js       # Routes portfolio/projets
│   ├── contact.js        # Formulaires contact
│   └── settings.js       # Paramètres du site
├── config/
│   └── database.js       # Configuration SQLite
├── middleware/
│   └── auth.js           # Middleware authentification
├── server.js             # Serveur Express principal
├── package.json          # Dépendances npm
├── .env                  # Variables d'environnement
└── database.db          # Base de données SQLite
```

---

## 🎨 Personnalisation

### Couleurs
Éditez les variables CSS dans `/public/css/styles.css`:
```css
:root {
  --primary: #1a1a1a;      /* Noir */
  --accent: #d4af37;       /* Doré */
  --light: #ffffff;        /* Blanc */
}
```

### Contenu du Site
Consultez **CONTENU_REDACTIONNEL.md** pour tous les textes proposés.

### Logo
Actuellement le logo est simplement le texte "Yimmo". Pour ajouter un logo image:
1. Placez l'image dans `/public/images/`
2. Modifiez le logo dans `/public/index.html` et `/public/admin.html`

### WhatsApp
Modifiez le numéro dans les fichiers HTML:
- Cherchez: `+41782430394`
- Remplacez par votre numéro

---

## 🗄️ Base de Données

### Tables SQLite

#### `projects`
Stocke les réalisations menuiserie
```sql
id (INT PRIMARY KEY)
title (TEXT) - Titre du projet
description (TEXT) - Description
category (TEXT) - portes, cuisines, chantiers
images (TEXT) - JSON array d'URLs
date_created (DATETIME)
updated_at (DATETIME)
```

#### `admin_users`
Utilisateurs administrateur
```sql
id (INT PRIMARY KEY)
email (TEXT UNIQUE) - Email de connexion
password (TEXT) - Mot de passe hashé (bcrypt)
name (TEXT) - Nom du compte
created_at (DATETIME)
```

#### `site_settings`
Paramètres du site
```sql
id (INT PRIMARY KEY)
key (TEXT UNIQUE) - Clé du paramètre
value (TEXT) - Valeur
updated_at (DATETIME)
```

#### `contacts`
Messages de contact reçus
```sql
id (INT PRIMARY KEY)
name (TEXT) - Nom du visiteur
email (TEXT) - Email
phone (TEXT) - Téléphone
subject (TEXT) - Sujet
message (TEXT) - Message
date_created (DATETIME)
status (TEXT) - new, read
```

#### `appointments`
Demandes de rendez-vous
```sql
id (INT PRIMARY KEY)
name (TEXT) - Nom
email (TEXT) - Email
phone (TEXT) - Téléphone
preferred_date (TEXT) - Date demandée
preferred_time (TEXT) - Heure demandée
message (TEXT) - Message/détails du projet
date_created (DATETIME)
status (TEXT) - pending, confirmed
```

### Accès à la Base de Données

La base de données est créée automatiquement au premier démarrage dans `database.db`.

Pour la consulter directement, utilisez un outil comme **DB Browser for SQLite** ou **SQLiteStudio**.

---

## 🔒 Sécurité

### Mesures implémentées

1. **Authentification JWT** - Tokens sécurisés pour l'admin
2. **Passwords hashés** - Utilisation de bcrypt
3. **Protection des routes** - Vérification du token sur `/api/admin/*`
4. **CORS** - Contrôle des origines
5. **Validation des entrées** - Contrôle basique sur les formulaires

### À faire avant la production

⚠️ **CRITIQUE:**

1. **Changez le mot de passe admin:**
   ```bash
   # Dans .env
   ADMIN_PASSWORD=un_mot_de_passe_très_complexe_ici
   ```

2. **Changez la clé JWT:**
   ```bash
   # Dans .env - Générez une clé aléatoire complexe
   JWT_SECRET=generez_une_clé_très_complexe_et_aléatoire
   ```

3. **Configurez HTTPS** - Utilisez un certificat SSL/TLS (Let's Encrypt gratuit)

4. **Sauvegarde de la base de données:**
   ```bash
   # Sauvegardez régulièrement database.db
   cp database.db database.backup.db
   ```

5. **Variables d'environnement:**
   - Ne commitez JAMAIS le fichier `.env`
   - Utilisez le fichier `.env.example` comme modèle
   - Changez toutes les valeurs par défaut

---

## 🚀 Déploiement

### Option 1: Heroku (Simple, recommandé)

1. Installez le CLI Heroku
2. Loggez-vous: `heroku login`
3. Créez une app: `heroku create yimmo-site`
4. Définissez les variables:
   ```bash
   heroku config:set JWT_SECRET=votre_clé_longue_et_complexe
   heroku config:set ADMIN_PASSWORD=votre_mot_de_passe_fort
   ```
5. Deployez:
   ```bash
   git push heroku main
   ```

### Option 2: VPS / Serveur Dédié

1. Accédez à votre serveur (SSH)
2. Installez Node.js
3. Clonez le projet
4. Installez les dépendances
5. Configurez `.env`
6. Utilisez un process manager comme **PM2**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "yimmo"
   pm2 startup
   pm2 save
   ```
7. Configurez un reverse proxy (Nginx)

### Option 3: Docker (Avancé)

Créez un `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Puis:
```bash
docker build -t yimmo .
docker run -p 3000:3000 -e JWT_SECRET=... yimmo
```

---

## 📧 Configuration Email (Optionnel)

Pour envoyer automatiquement des emails lors de contacts/rendez-vous:

1. Installez un service email (Sendgrid, Nodemailer)
2. Modifiez `/routes/contact.js`
3. Ajoutez le code d'envoi d'email

Exemple avec Nodemailer:
```bash
npm install nodemailer
```

---

## 🛠️ Maintenance

### Sauvegardes
Sauvegardez régulièrement:
```bash
cp database.db database.$(date +%Y%m%d_%H%M%S).backup.db
```

### Monitoring
Vérifiez les logs du serveur pour détecter les erreurs:
```bash
npm run dev  # Logs en direct en mode développement
```

### Mises à jour
Mettez à jour les dépendances:
```bash
npm update
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifiez le port 3000
# Vérifiez que Node.js est installé: node --version
# Vérifiez les dépendances: npm install
```

### Erreur de connexion admin
- Vérifiez le mot de passe dans `.env`
- Vérifiez le JWT_SECRET dans `.env`
- Videz le cache du navigateur (Ctrl+Shift+Delete)

### Projets ne s'affichent pas
- Assurez-vous d'avoir accès à l'admin
- Vérifiez que le projet a au moins un titre et une description
- Vérifiez que les catégories sont correctes

### Formulaires ne fonctionnent pas
- Vérifiez que le serveur est en cours d'exécution
- Vérifiez les logs du navigateur (F12 → Console)
- Vérifiez que les ports sont ouverts (firewall)

---

## 📞 Support

Pour toute question ou problème:
- **Email:** Yousri@yimmosarl.com
- **Téléphone:** +41 78 243 03 94
- **WhatsApp:** Même numéro

---

## 📄 Licence

Copyright © 2024 Yimmo SARL. Tous droits réservés.

---

## ✅ Checklist Mise en Ligne

Avant de mettre en ligne:

- [ ] Changez le mot de passe admin dans `.env`
- [ ] Changez la clé JWT dans `.env`
- [ ] Testez la connexion admin
- [ ] Testez les formulaires (contact, rendez-vous)
- [ ] Testez le responsive sur mobile
- [ ] Vérifiez que les liens WhatsApp fonctionnent
- [ ] Testez tous les boutons et liens
- [ ] Optimisez les images (taille < 500KB chacune)
- [ ] Configurez HTTPS/SSL
- [ ] Mettez en place les backups automatiques
- [ ] Testez en conditions réelles

---

**Dernière mise à jour:** 2024
